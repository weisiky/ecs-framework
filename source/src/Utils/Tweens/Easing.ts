module es {
    /**
     * 通过将b和c参数(开始和更改值)替换为0和1，然后减小，简化了标准的简化方程。
     * 这样做是为了我们可以得到一个0 - 1之间的原始值(除了弹性/弹跳，它故意越过边界)，然后使用这个值来lerp任何东西。
     */
    export class Easing {

    }

    export class Linear {
        public static easeNone(t: number, d: number){
            return t / d;
        }
    }

    export class Quartic {
        public static easeIn(t: number, d: number){
            return (t /= d) * t * t * t;
        }

        public static easeOut(t: number, d: number){
            return -1 * ((t = t / d - 1) * t * t * t - 1);
        }

        public static easeInOut(t: number, d: number){
            t /= d / 2;
            if (t < 1)
                return 0.5 * t * t * t * t;

            t -= 2;
            return -0.5 * (t * t * t * t - 2);
        }
    }

    export class Exponential {
        public static easeIn(t: number, d: number){
            return (t == 0) ? 0 : Math.pow(2, 10 * (t / d - 1));
        }

        public static easeOut(t: number, d: number){
            return t == d ? 1 : (-Math.pow(2, -10 * t / d) + 1);
        }

        public static easeInOut(t: number, d: number){
            if (t == 0) return 0;
            if (t == d) return 1;
            if ((t /= d / 2) < 1){
                return 0.5 * Math.pow(2, 10 * (t - 1));
            }
            return 0.5 * (-Math.pow(2, -10 * --t) + 2);
        }
    }
}