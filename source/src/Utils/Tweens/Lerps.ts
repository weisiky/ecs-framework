module es {
    /**
     * 一系列静态方法，用于处理所有常见的渐变类型结构
     */
    export class Lerps {
        public static easeNumber(easeType: EaseType, from: number, to: number, t: number, duration: number): number {
            return Lerps.lerpNumber(from, to, EaseHelper.ease(easeType, t, duration));
        }

        public static easeColor(easeType: EaseType, from: Color, to: Color, t: number, duration: number): Color{
            return Lerps.lerpColor(from, to, EaseHelper.ease(easeType, t, duration));
        }

        public static lerpColor(from: Color, to: Color, t: number): Color{
            let t255 = Math.floor(t * 255);
            return new Color(from.r + (to.r - from.r) * t255 / 255, from.g + (to.g - from.g) * t255 / 255,
                from.b + (to.b - from.b) * t255 / 255, from.a + (to.a - from.a) * t255 / 255);
        }

        public static lerpNumber(from: number, to: number, t: number): number{
            return (from + (to - from) * t);
        }
    }
}