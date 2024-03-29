class Matrix {
    constructor(t, o, r){
        this.x = t, this.y = o, this.z = r
    }
    dot2(t, o) {
        return this.x * t + this.y * o
    }
}

export class Noise {
    constructor() {        
        this.e = [new Matrix(1, 1, 0), new Matrix((-1), 1, 0), new Matrix(1, (-1), 0), new Matrix((-1), (-1), 0), new Matrix(1, 0, 1), new Matrix((-1), 0, 1), new Matrix(1, 0, (-1)), new Matrix((-1), 0, (-1)), new Matrix(0, 1, 1), new Matrix(0, (-1), 1), new Matrix(0, 1, (-1)), new Matrix(0, (-1), (-1))],
        this.i = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180],
        this.d = new Array(512),
        this.f = new Array(512);

        this.seed(0);
        this.h = .5 * (Math.sqrt(3) - 1);
        this.v = (3 - Math.sqrt(3)) / 6;
        this.u = 1 / 3;
        this.s = 1 / 6;
    }
    seed(t) {
        t > 0 && t < 1 && (t *= 65536), t = Math.floor(t), t < 256 && (t |= t << 8);
        for (let o = 0; o < 256; o++) {
            let r;
            r = 1 & o ? this.i[o] ^ 255 & t : this.i[o] ^ t >> 8 & 255, this.d[o] = this.d[o + 256] = r, this.f[o] = this.f[o + 256] = this.e[r % 12]
        }
    }

    simplex2(t, o) {
        let r, n, a, e, i, u = (t + o) * this.h,
            s = Math.floor(t + u),
            l = Math.floor(o + u),
            w = (s + l) * this.v,
            M = t - s + w,
            c = o - l + w;
        M > c ? (e = 1, i = 0) : (e = 0, i = 1);
        let p = M - e + this.v,
            y = c - i + this.v,
            x = M - 1 + 2 * this.v,
            m = c - 1 + 2 * this.v;
        s &= 255, l &= 255;
        let q = this.f[s + this.d[l]],
            z = this.f[s + e + this.d[l + i]],
            A = this.f[s + 1 + this.d[l + 1]],
            b = .5 - M * M - c * c;
        b < 0 ? r = 0 : (b *= b, r = b * b * q.dot2(M, c));
        let g = .5 - p * p - y * y;
        g < 0 ? n = 0 : (g *= g, n = g * g * z.dot2(p, y));
        let j = .5 - x * x - m * m;
        return j < 0 ? a = 0 : (j *= j, a = j * j * A.dot2(x, m)), 70 * (r + n + a)
    }
};