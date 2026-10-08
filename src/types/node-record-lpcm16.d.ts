declare module "node-record-lpcm16" {
  interface RecordOptions {
    sampleRate?: number;
    channels?: number;
    audioType?: string;
    recorder?: string;
    device?: string;
  }

  interface Recording {
    stream(): NodeJS.ReadableStream;
    stop(): void;
  }

  function record(options?: RecordOptions): Recording;

  export = {
    record,
  };
}
