import { randomInRange, extend, uuidv4 } from './utils';
import { Noise } from './noise'

const _svgNS = 'http://www.w3.org/2000/svg';

class SvgBlob {
  constructor(elements, options) {
    this.noise = new Noise()
    this.init(elements, options)
  }

  get defaults() {
    return {
      clipPadding: 20,
      minPointsDistance: 80,
      speedFactor: 1,
      animateOnHover: true,
      round: true,
      debug: false
    };
  }

  init(elements, options) {
    this.options = extend({}, this.defaults, options)
    let nodes = (typeof elements === 'string') ? document.querySelectorAll(elements) : elements
    this.elements = []
    nodes.forEach((node, index) => {
      this.elements.push(this.initElement(node))
      this.updatePath(index, 0)
      if (this.options.animateOnHover) {
        node.addEventListener('mouseenter', this.resumeAnimation.bind(this, index))
        node.addEventListener('mouseleave', this.pauseAnimation.bind(this, index))
      }
    });
  }

  initElement(node) {
    let width = node.offsetWidth
    let height = node.offsetHeight
    let points = this.getPoints(width, height, this.options)
    let svg = document.createElementNS(_svgNS, 'svg')
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height + '')
    let path = document.createElementNS(_svgNS, 'path')
    path.setAttribute('class', 'svg-blob__path')
    if (this.options.debug) {
      svg.setAttribute('class', 'svg-blob__svg --debug')
      svg.appendChild(path)
    } else {
      svg.setAttribute('class', 'svg-blob__svg')
      let defs = document.createElementNS(_svgNS, 'defs')
      svg.appendChild(defs)
      let clipPath = document.createElementNS(_svgNS, 'clipPath')
      let clipPathId = 'svg-blob__clip--' + uuidv4() + ''
      clipPath.setAttribute('id', clipPathId)
      defs.appendChild(clipPath)
      node.style.clipPath = 'url(#' + clipPathId + ')'
      clipPath.appendChild(path)
    }
    node.insertBefore(svg, node.firstChild)
    return {
      node: node,
      points: points,
      svg: svg,
      path: path,
      time: randomInRange(0, 10000),
      raf: {
        id: 0,
        timeDiff: 0,
        paused: true
      }
    }
  }

  getPoints(width, height) {
    let clipPadding = this.options.clipPadding
    let sides = [{ name: 'top', points: this.generatePoints(width) }, { name: 'right', points: this.generatePoints(height) }, { name: 'bottom', points: this.generatePoints(width) }, { name: 'left', points: this.generatePoints(height) }]
    let points = []
    sides.forEach(function (side) {
      let horizontal = side.name === 'top' || side.name === 'bottom'
      let topOrRight = side.name === 'top' || side.name === 'right'
      let topOrLeft = side.name === 'top' || side.name === 'left'
      let value, valueRange, randRange
      side.points.forEach(function (point) {
        value = topOrRight ? point : (horizontal ? width : height) - point
        valueRange = topOrRight ? [value - clipPadding, value] : [value, value + clipPadding]
        randRange = topOrLeft ? [0, clipPadding] : [-clipPadding, 0]
        if (side.name === 'right') {
          randRange[0] += width
          randRange[1] += width
        } else if (side.name === 'bottom') {
          randRange[0] += height
          randRange[1] += height
        }
        points.push({ xRange: horizontal ? valueRange : randRange, yRange: horizontal ? randRange : valueRange })
      })
    })
    return points
  }

  generatePoints(len) {
    let minPointsDistance = this.options.minPointsDistance
    let points = []
    let lines = [{ x: 0, w: len }]
    function splitLine() {
      if (lines.length) {
        let line = lines.shift()
        if (line.w > minPointsDistance * 2) {
          let line1Size = randomInRange(minPointsDistance, line.w - minPointsDistance)
          let line1 = extend({}, line, { w: line1Size })
          let line2 = extend({}, line, { x: line.x + line1Size, w: line.w - line1Size })
          lines.push(line1, line2)
        } else {
          points.push(line)
          splitLine()
        }
      } else {
        points = points.sort(function (a, b) { return a.x - b.x }).map(function (line) { return line.x })
        points.shift()
        points.push(len)
      }
    }
    while (lines.length) { splitLine() }
    return points
  }

  updatePath(index, timeDiff) {
    let speedFactor = this.options.speedFactor
    let element = this.elements[index]
    let time = element.time + timeDiff
    element.points.forEach((point, pointIndex) => {
      let noiseX = (this.noise.simplex2(pointIndex * 2, time * 0.0005 * speedFactor) + 1) / 2
      let noiseY = (this.noise.simplex2(pointIndex * 2 + 1, time * 0.0005 * speedFactor) + 1) / 2
      let xMin = point.xRange[0]
      let xMax = point.xRange[1]
      let yMin = point.yRange[0]
      let yMax = point.yRange[1]
      point.x = noiseX * (xMax - xMin) + xMin
      point.y = noiseY * (yMax - yMin) + yMin
    })
    element.path.setAttribute('d', this.buildPath(element.points))
  }

  buildPath(points) {
    let d = 'M ' + points[0].x + ' ' + points[0].y + ''
    let i, p0, p1, len = points.length
    for (i = 0; i <= len; i++) {
      p0 = points[i >= len ? i - len : i]
      p1 = points[i + 1 >= len ? i + 1 - len : i + 1]
      if (this.options.round) { d += ' Q ' + p0.x + ' ' + p0.y + ' ' + (p0.x + p1.x) * 0.5 + ' ' + (p0.y + p1.y) * 0.5 + '' } else { d += ' L ' + p0.x + ' ' + p0.y + '' }
    }
    return d
  }

  resumeAnimation(index) {
    let raf = this.elements[index].raf
    if (raf.paused) {
      let time0 = performance.now()
      let time1, timeDiff
      let self = this
      function render() {
        time1 = performance.now()
        timeDiff = time1 - time0
        self.updatePath(index, timeDiff)
        raf.timeDiff = timeDiff
        raf.id = requestAnimationFrame(render)
      }
      raf.paused = false
      raf.timeDiff = 0
      raf.id = requestAnimationFrame(render)
    }
  }

  pauseAnimation(index) {
    let element = this.elements[index]
    let raf = element.raf
    if (!raf.paused) {
      cancelAnimationFrame(raf.id)
      element.time += raf.timeDiff
      raf.paused = true
    }
  }
}

export default SvgBlob;