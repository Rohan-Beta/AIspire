"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";

const NotFound: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      alert("WebGL not supported");
      return;
    }

    const vsSource = `
      attribute vec2 a_position;
      void main() {
          gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      uniform float t;
      uniform vec2 r;

      vec2 myTanh(vec2 x) {
          vec2 ex = exp(x);
          vec2 emx = exp(-x);
          return (ex - emx) / (ex + emx);
      }

      void main() {
          vec4 o_bg = vec4(0.0);
          vec4 o_anim = vec4(0.0);

          {
              vec2 p_img = (gl_FragCoord.xy * 2.0 - r) / r.y * mat2(1.0, -1.0, 1.0, 1.0);
              vec2 l_val = myTanh(p_img * 5.0 + 2.0);
              l_val = min(l_val, l_val * 3.0);

              vec2 clamped = clamp(l_val, -2.0, 0.0);
              float diff_y = clamped.y - l_val.y;
              float safe_px = abs(p_img.x) < 0.001 ? 0.001 : p_img.x;

              float term = (0.1 - max(0.01 - dot(p_img, p_img) / 200.0, 0.0) * (diff_y / safe_px))
                          / abs(length(p_img) - 0.7);

              o_bg += vec4(term);
              o_bg *= max(o_bg, vec4(0.0));
          }

          {
              vec2 p_anim = (gl_FragCoord.xy * 2.0 - r) / r.y / 0.7;
              vec2 d = vec2(-1.0, 1.0);

              float denom = 0.1 + 5.0 / dot(5.0 * p_anim - d, 5.0 * p_anim - d);
              vec2 c = p_anim * mat2(1.0, 1.0, d.x / denom, d.y / denom);
              vec2 v = c;

              v *= mat2(
                cos(log(length(v)) + t * 0.2), sin(log(length(v)) + t * 0.2),
                -sin(log(length(v)) + t * 0.2), cos(log(length(v)) + t * 0.2)
              ) * 5.0;

              vec4 animAccum = vec4(0.0);

              for(int i = 1; i <= 9; i++) {
                  float fi = float(i);
                  animAccum += sin(vec4(v.x, v.y, v.y, v.x)) + vec4(1.0);
                  v += 0.7 * sin(vec2(v.y, v.x) * fi + t) / fi + 0.5;
              }

              vec4 animTerm = 1.0 - exp(
                  -exp(c.x * vec4(0.6, -0.4, -1.0, 0.0))
                  / animAccum
                  / (0.1 + 0.1 * pow(length(sin(v / 0.3) * 0.2 + c * vec2(1.0, 2.0)), 2.0))
                  / (1.0 + 7.0 * exp(0.3 * c.y - dot(c, c)))
                  / (0.03 + abs(length(p_anim) - 0.7)) * 0.2
              );

              o_anim += animTerm;
          }

          vec4 finalColor = mix(o_bg, o_anim, 0.5) * 1.5;
          finalColor = clamp(finalColor, 0.0, 1.0);
          gl_FragColor = finalColor;
      }
    `;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const createProgram = (gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram | null => {
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
      if (!vertexShader || !fragmentShader) return null;

      const program = gl.createProgram();
      if (!program) return null;

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program link error:", gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }

      return program;
    };

    const program = createProgram(gl, vsSource, fsSource);
    if (!program) return;

    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const timeLocation = gl.getUniformLocation(program, "t");
    const resolutionLocation = gl.getUniformLocation(program, "r");

    const vertices = new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };

    window.addEventListener("resize", resize);
    resize();

    const startTime = performance.now();

    const render = () => {
      const now = performance.now();
      const time = (now - startTime) / 1000;

      if (timeLocation) gl.uniform1f(timeLocation, time);
      if (resolutionLocation) gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

      <ul className="links absolute right-5 bottom-10 w-44 list-none p-0 m-0 text-xs font-light uppercase text-white font-sans tracking-widest">
        <li className="border-b border-white/10">
          <Link href={"/"} className=" block text-right opacity-40 hover:opacity-80 transition-opacity duration-200 who">
            <button className="cursor-pointer">Return To Home Page?</button>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default NotFound;
