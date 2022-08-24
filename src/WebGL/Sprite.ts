import Material from "./Material";
// interface HTMLImageElement {
//   sprite: any
// }
interface ImageSprite extends HTMLImageElement {
  sprite: Sprite;
}
class Sprite {
  private gl: WebGL2RenderingContext;
  private material: Material;
  public isLoaded: boolean;
  public image: ImageSprite;
  private gltex: WebGLTexture;
  private texBuff: WebGLBuffer;
  private geoBuff: WebGLBuffer;
  private aPositionLoc;
  private aTexcoordLoc;
  private uImageLoc;
  static createRectArray(x = 0, y = 0, w = 1, h = 1) {
    return new Float32Array([
      x,
      y,
      x + w,
      y,
      x,
      y + h,
      x,
      y + h,
      x + w,
      y,
      x + w,
      y + h,
    ]);
  }

  constructor(
    gl: WebGL2RenderingContext,
    imgURL: string,
    vs: string,
    fs: string
  ) {
    this.isLoaded = false;
    this.gl = gl;

    this.material = new Material(gl, vs, fs);

    let image = new Image() as ImageSprite;
    this.image = image;
    image.src = imgURL;
    image.sprite = this;
    image.crossOrigin = "anonymous";
    image.onload = function () {
      console.log("LOADED");
      // @ts-ignore
      this.sprite.setup();
    };
  }

  public setup = () => {
    const gl = this.gl;
    gl.useProgram(this.material.program);
    const gltex = gl.createTexture();
    this.gltex = gltex;
    gl.bindTexture(gl.TEXTURE_2D, gltex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    // @ts-ignore
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.image
    );
    gl.bindTexture(gl.TEXTURE_2D, null);

    const texBuff = gl.createBuffer();
    this.texBuff = texBuff;
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuff);
    gl.bufferData(gl.ARRAY_BUFFER, Sprite.createRectArray(), gl.STATIC_DRAW);

    const geoBuff = gl.createBuffer();
    this.geoBuff = geoBuff;
    gl.bindBuffer(gl.ARRAY_BUFFER, geoBuff);
    gl.bufferData(gl.ARRAY_BUFFER, Sprite.createRectArray(), gl.STATIC_DRAW);

    this.aPositionLoc = gl.getAttribLocation(
      this.material.program,
      "a_position"
    );
    this.aTexcoordLoc = gl.getAttribLocation(
      this.material.program,
      "a_texCoord"
    );
    this.uImageLoc = gl.getUniformLocation(this.material.program, "u_image");

    gl.useProgram(null);
    this.isLoaded = true;
  };

  public render() {
    if (this.isLoaded) {
      let gl = this.gl;

      gl.useProgram(this.material.program);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.gltex);
      gl.uniform1i(this.uImageLoc, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuff);
      gl.enableVertexAttribArray(this.aTexcoordLoc);
      gl.vertexAttribPointer(this.aTexcoordLoc, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.geoBuff);
      gl.enableVertexAttribArray(this.aPositionLoc);
      gl.vertexAttribPointer(this.aPositionLoc, 2, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);

      gl.useProgram(null);
    }
  }
}

export default Sprite;
