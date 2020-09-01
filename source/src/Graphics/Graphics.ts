module es {
    import BitmapData = egret.BitmapData;

    export class Graphics {
        public static createSingleColorTexture(width: number, height: number, color: Color){
            let texture = new egret.Texture();
            let data = new ArrayBuffer(width * height);
            for (let i = 0; i < data.byteLength; i ++){
                data[i] = color;
            }
            let bitmapData = BitmapData.create("arraybuffer", data);
            texture._setBitmapData(bitmapData);
            return texture;
        }
    }
}