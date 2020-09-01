///<reference path="./SceneTransition.ts"/>
module es {
    export class FadeTransition extends SceneTransition {
        public fadeToColor: Color = new Color(0, 0, 0, 255);
        /**
         * 褪色到褪色的持续时间
         */
        public fadeOutDuration = 0.4;
        public fadeEaseType: EaseType = EaseType.quartOut;
        /**
         * 延迟开始淡出
         */
        public delayBeforeFadeInDuration = 0.1;
        /**
         * 从fadeToColor到新场景的淡出时间
         */
        public fadeInDuration = 0.6;

        public _color = new Color(255, 255, 255, 255);
        public _fromColor = new Color(255,255,255,255);
        public _toColor = new Color(0, 0, 0, 0);

        public _overlayTexture: egret.Texture;
        public _overlayBitmap: egret.Bitmap;
        public _destinationRect: Rectangle;

        constructor(sceneLoadAction: Function) {
            super(sceneLoadAction);
        }

        public* onBeginTransition(): any {
            this._overlayTexture = Graphics.createSingleColorTexture(Core.scene.width, Core.scene.height, this.fadeToColor);
            this._overlayBitmap = new egret.Bitmap(this._overlayTexture);

            let elapsed = 0;
            while (elapsed < this.fadeOutDuration){
                elapsed += Time.deltaTime;
                this._color = Lerps.easeColor(this.fadeEaseType, this._toColor, this._fromColor, elapsed, this.fadeOutDuration);
                yield null;
            }

            yield Core.startCoroutine(this.loadNextScene());

            this.previousSceneRender.dispose();
            this.previousSceneRender = null;

            yield Coroutine.waitForSeconds(this.delayBeforeFadeInDuration);

            elapsed = 0;
            while (elapsed < this.fadeInDuration){
                elapsed += Time.deltaTime;
                this._color = Lerps.easeColor(EaseHelper.oppositeEaseType(this.fadeEaseType), this._fromColor, this._toColor, elapsed, this.fadeInDuration);

                yield null;
            }

            this.transitionComplete();
            this._overlayTexture.dispose();
        }

        protected transitionComplete(){
            super.transitionComplete();

            if (this._overlayBitmap.parent)
                this._overlayBitmap.parent.removeChild(this._overlayBitmap);

            if (this.previousSceneRenderBitmap.parent)
                this._overlayBitmap.parent.removeChild(this.previousSceneRenderBitmap);
        }

        public render() {
            // 我们只渲染前一个场景，淡入颜色。之后它将为空。
            if (!this.isNewSceneLoaded){
                this.previousSceneRender.drawToTexture(Core.scene, this._destinationRect);
                this.previousSceneRenderBitmap = new egret.Bitmap(this.previousSceneRender);

                if (!this.previousSceneRenderBitmap.parent)
                    Core.scene.stage.addChild(this.previousSceneRenderBitmap);
            }

            if (!this._overlayBitmap.parent)
                Core.scene.stage.addChild(this._overlayBitmap);

            this._overlayBitmap.filters = [DrawUtils.getColorMatrix(this._color.packedValue)];
        }
    }
}
