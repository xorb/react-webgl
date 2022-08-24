class Material {
  private gl: WebGL2RenderingContext;
  public program: WebGLProgram;
  constructor(gl: WebGL2RenderingContext, vs: string, fs: string) {
    this.gl = gl;
    let vsShader = this.getShader(vs, gl.VERTEX_SHADER);
    let fsShader = this.getShader(fs, gl.FRAGMENT_SHADER);
    if (vsShader && fsShader) {
      const program = gl.createProgram();
      this.program = program;
      gl.attachShader(program, vsShader);
      gl.attachShader(program, fsShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("CANNOT LOAD SHADER", gl.getProgramInfoLog(program));
        return null;
      }
      gl.detachShader(program, vsShader);
      gl.detachShader(program, fsShader);
      gl.deleteShader(vsShader);
      gl.deleteShader(fsShader);

      gl.useProgram(null);
    }
  }

  private getShader = (script: string, type: number) => {
    let gl = this.gl;
    let output = gl.createShader(type);
    gl.shaderSource(output, script);
    gl.compileShader(output);

    if (!gl.getShaderParameter(output, gl.COMPILE_STATUS)) {
      console.log("error compiling", gl.getShaderInfoLog(output));
      return null;
    }
    return output;
  };
}
export default Material;
