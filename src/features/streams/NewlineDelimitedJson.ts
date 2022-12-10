/** Streaming newline-delimited JSON */
export class NewlineDelimitedJsonTransformer
  implements Transformer<Uint8Array, any>
{
  buffer: string = "";
  decoder: TextDecoder = new TextDecoder();

  transform(chunk: Uint8Array, controller: TransformStreamDefaultController) {
    const decodedChunk = this.decoder
      .decode(chunk)
      .replace(/\r\n/g, "\n")
      .replace(/\r/, "");

    (this.buffer + decodedChunk)
      .split("\n")
      .forEach((line, index, collection) => {
        try {
          const parsed = JSON.parse(line);
          controller.enqueue(parsed);
        } catch (parserError) {
          const isLastLine = index + 1 === collection.length;
          if (isLastLine) {
            // last string from split is non-terminated line
            // if input is bad, this COULD result in a parsing error on the first line of the next transform call
            this.buffer = line;
          } else {
            throw parserError;
          }
        }
      });
  }
}
