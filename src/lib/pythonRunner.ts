import { spawn } from "child_process";

export interface PythonResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

function collectOutput(stream: NodeJS.ReadableStream) {
  let data = "";
  stream.on("data", (chunk) => {
    data += chunk.toString();
  });
  return () => data;
}

export async function runPython(args: string[]): Promise<PythonResult> {
  const pythonBin = process.env.PYTHON_BIN || "python3";
  const child = spawn(pythonBin, args, {
    cwd: process.cwd(),
    env: process.env,
  });

  const getStdout = collectOutput(child.stdout);
  const getStderr = collectOutput(child.stderr);

  const exitCode: number = await new Promise((resolve) => {
    child.on("close", resolve);
  });

  return {
    exitCode,
    stdout: getStdout(),
    stderr: getStderr(),
  };
}
