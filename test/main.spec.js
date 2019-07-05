const { SvgBlob } = require('../src/main');

describe('SvgBlob', () => {
    it('creates correctly', () => {
        document.body.innerHTML = '<div> Some text </div>';

        const blob = new SvgBlob('div');

        expect(blob).toMatchObject({
            noise: {
              e: expect.anything(),
              i: expect.anything(),
              d: expect.anything(),
              f: expect.anything(),
              h: 0.3660254037844386,
              v: 0.21132486540518713,
              u: 0.3333333333333333,
              s: 0.16666666666666666
            },
            options: {
              clipPadding: 20,
              minPointsDistance: 80,
              speedFactor: 1,
              animateOnHover: true,
              round: true,
              debug: false
            },
            elements: [
              {
                node: {},
                points: [
                  {
                    xRange: [
                      -20,
                      0
                    ],
                    yRange: [
                      0,
                      20
                    ],
                    x: -14.520010346817639,
                    y: 6.144337963746217
                  },
                  {
                    xRange: [
                      -20,
                      0
                    ],
                    yRange: [
                      -20,
                      0
                    ],
                    x: -13.385749438628105,
                    y: -5.351541224947226
                  },
                  {
                    xRange: [
                      0,
                      20
                    ],
                    yRange: [
                      -20,
                      0
                    ],
                    x: 8.824919762220686,
                    y: -17.219132768944498
                  },
                  {
                    xRange: [
                      0,
                      20
                    ],
                    yRange: [
                      0,
                      20
                    ],
                    x: 10.687856955488053,
                    y: 8.618515528838778
                  }
                ],
                svg: {},
                path: {},
                time: 1933,
                raf: {
                  id: 0,
                  timeDiff: 0,
                  paused: true
                }
              }
            ]
          })
    });
});