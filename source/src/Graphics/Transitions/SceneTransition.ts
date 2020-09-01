module es {
    /**
     * SceneTransition用于从一个场景过渡到另一个场景或在一个有效果的场景中过渡
     */
    export abstract class SceneTransition {
        /** 包含上一个场景的最后渲染。可以用来在加载新场景时模糊屏幕。 */
        public previousSceneRender: egret.RenderTexture;
        public previousSceneRenderBitmap: egret.Bitmap;
        /** 如果为true，框架会将之前的场景渲染到previousSceneRender中，这样你就可以在转换时使用它 */
        public wantsPreviousSceneRender: boolean;
        /** 是否加载新场景的标志 */
        public loadsNewScene: boolean;
        /**
         * 将此用于两个部分的转换。例如，淡出会先淡出到黑色，然后当isNewSceneLoaded为true，它会淡出。
         * 对于场景过渡，isNewSceneLoaded应该在中点设置为true，这就标识一个新的场景被加载了。
         */
        public isNewSceneLoaded: boolean;
        /** 在loadNextScene执行时调用。这在进行场景间过渡时很有用，这样你就知道什么时候可以更多地使用相机或者重置任何实体 */
        public onScreenObscured: Function;
        /** 当转换完成执行时调用，以便可以调用其他工作，比如启动另一个转换。 */
        public onTransitionCompleted: Function;
        /** 如果为true，下一个场景将在后台线程上加载 */
        public loadSceneOnBackgroundThread: boolean;
        /** 返回新加载场景的函数 */
        protected sceneLoadAction: Function;

        protected constructor(sceneLoadAction: Function, wantsPreviousSceneRender: boolean = true) {
            this.sceneLoadAction = sceneLoadAction;
            this.wantsPreviousSceneRender = wantsPreviousSceneRender;
            this.loadsNewScene = sceneLoadAction != null;

            // 如果以后需要的话，创建一个RenderTexture
            if (wantsPreviousSceneRender)
                this.previousSceneRender = new egret.RenderTexture();
        }

        private _hasPreviousSceneRender: boolean;

        public get hasPreviousSceneRender() {
            if (!this._hasPreviousSceneRender) {
                this._hasPreviousSceneRender = true;
                return false;
            }

            return true;
        }

        /**
         * 在渲染场景之前调用。这允许在需要时转换渲染到渲染目标，并避免在使用渲染目标时清除framebuffer的问题。
         */
        public preRender() {
        }

        /**
         * 在这里完成你所有的渲染。这是一个基本实现。任何特殊的呈现都应该覆盖此方法。
         */
        public render() {

        }

        public* onBeginTransition(): any {
            yield null;
            yield Core.startCoroutine(this.loadNextScene());
            this.transitionComplete();
        }

        public* tickEffectProgressProperty(filter: egret.CustomFilter, duration: number, easeType: EaseType = EaseType.expoOut, reverseDirection = false) {
            let start = reverseDirection ? 1 : 0;
            let end = reverseDirection ? 0 : 1;

            let elapsed = 0;
            while (elapsed < duration){
                elapsed += Time.deltaTime;
                let step = Lerps.easeNumber(easeType, start, end, elapsed, duration);
                filter.uniforms._progress = step;

                yield null;
            }
        }

        protected transitionComplete() {
            Core._instance._sceneTransition = null;

            if (this.previousSceneRender){
                this.previousSceneRender.dispose();
                this.previousSceneRender = null;
            }

            if (this.onTransitionCompleted) {
                this.onTransitionCompleted();
            }
        }

        protected* loadNextScene() {
            if (this.onScreenObscured)
                this.onScreenObscured();

            if (!this.loadsNewScene) {
                this.isNewSceneLoaded = true;
                yield;
            }

            if (this.loadSceneOnBackgroundThread){
                let scene = this.sceneLoadAction();
                Core.schedule(0, false, this, timer => {
                    Core.scene = scene;
                    this.isNewSceneLoaded = true;
                });
            }else{
                Core.scene = this.sceneLoadAction();
                this.isNewSceneLoaded = true;
            }

            // 如果场景是在后台线程加载的，则等待场景加载
            while (!this.isNewSceneLoaded)
                yield null;
        }
    }
}
