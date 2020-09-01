module es {
    export enum EaseType {
        quartIn,
        quartOut,
        expoIn,
        expoOut,
    }

    /**
     * 带有单一方法的helper，该方法接受EaseType并应用具有给定持续时间和时间参数的ease方程。
     * 我们这样做是为了避免传递会给垃圾收集器带来大量垃圾的函数
     */
    export class EaseHelper {
        public static oppositeEaseType(easeType: EaseType){
            switch (easeType) {
                case EaseType.quartIn:
                    return EaseType.quartOut;
                case EaseType.quartOut:
                    return EaseType.quartIn;
                case EaseType.expoIn:
                    return EaseType.expoOut;
                case EaseType.expoOut:
                    return EaseType.expoIn;
                default:
                    return easeType;
            }
        }

        public static ease(easeType: EaseType, t: number, duration: number): number{
            switch (easeType) {
                case EaseType.expoIn:
                    return Exponential.easeIn(t, duration);
                case EaseType.expoOut:
                    return Exponential.easeInOut(t, duration);
                case EaseType.quartIn:
                    return Quartic.easeIn(t, duration);
                case EaseType.quartOut:
                    return Quartic.easeOut(t, duration);
                default:
                    return Linear.easeNone(t, duration);
            }
        }
    }
}