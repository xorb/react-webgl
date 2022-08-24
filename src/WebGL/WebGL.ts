import Material from "./Material";
import { FragmentShader, VertextShader } from "./Shaders";
import Sprite from "./Sprite";

class WebGL {
  protected elementId: string;
  private canvasEl: HTMLCanvasElement;
  public gl: WebGL2RenderingContext;
  public sprite1: Sprite;
  public sprite2: Sprite;
  // public material: Material;

  constructor(id: string) {
    this.elementId = id;
    this.canvasEl = document.getElementById(id) as HTMLCanvasElement;
    this.canvasEl.height = 600;
    this.canvasEl.width = 800;
    this.gl = this.canvasEl.getContext("webgl2");
    this.gl.clearColor(0.0, 0.8, 0.0, 1.0);
    // this.material = new Material(this.gl, VertextShader, FragmentShader);
    this.sprite1 = new Sprite(
      this.gl,
      "https://i.ibb.co/fFZDh0p/nolt.png",
      VertextShader,
      FragmentShader
    );

    this.sprite2 = new Sprite(
      this.gl,
      "https://i.ibb.co/vh0zdFZ/npc-smith.png",
      VertextShader,
      FragmentShader
    );
  }
  public update = () => {
    this.gl.viewport(0, 0, this.canvasEl.width, this.canvasEl.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.sprite1.render();
    this.sprite2.render();

    this.gl.flush();
  };
}

export default WebGL;
