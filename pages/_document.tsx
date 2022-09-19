import Document, {  Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <canvas id="webglview" width="500" height="500" style={{ position: 'absolute', top: 0, left: 0, backgroundColor: '#0f0' }}></canvas>
          <script
            id="vertexShader"
            type="x-shader/x-vertex"
            dangerouslySetInnerHTML={{
              __html: `
              attribute vec4 position;void main(){gl_Position = position;}
              `
            }}
          />
          <script
            id="fragmentShader"
            type="x-shader/x-fragment"
            dangerouslySetInnerHTML={{
              __html: `
              void main(){gl_FragColor=vec4(1.,0.,0.,1.);}
              `
            }}
          />

          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.onload = () => {
                  var canvasObject = document.getElementById("webglview");
                  var webgl = canvasObject.getContext("experimental-webgl");

                  if (webgl == null) {
                      alert("do not support webgl");
                      return;
                  }

                  var vsh =  document.getElementById( 'vertexShader' ).textContent
                  var fsh = document.getElementById( 'fragmentShader' ).textContent

                  var vshader = webgl.createShader(webgl.VERTEX_SHADER);
                  var fshader = webgl.createShader(webgl.FRAGMENT_SHADER);

                  webgl.shaderSource(vshader, vsh);
                  webgl.shaderSource(fshader, fsh);

                  webgl.compileShader(vshader);
                  webgl.compileShader(fshader);

                  var program = webgl.createProgram();

                  webgl.attachShader(program, vshader);
                  webgl.attachShader(program, fshader);

                  webgl.bindAttribLocation(program, 0, "test");
                  webgl.linkProgram(program);

                  if (!webgl.getProgramParameter(program, webgl.LINK_STATUS)) {
                      alert(webgl.getProgramInfoLog(program));
                      return;
                  }

                  webgl.useProgram(program);

                  var buffer = webgl.createBuffer();

                  webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);

                  webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0]), webgl.STATIC_DRAW);

                  webgl.enableVertexAttribArray(0);

                  webgl.vertexAttribPointer(0, 3, webgl.FLOAT, false, 0, 0);

                  webgl.clearColor(0, 0, 0, 1);

                  webgl.clear(webgl.COLOR_BUFFER_BIT);

                  webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, 3);
                };
              `
            }}
          />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
