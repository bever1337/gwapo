export class TransformBatches implements Transformer<any[], any[]> {
  batchSize: number = 100;
  batch: any[] = [];

  flush(controller: TransformStreamDefaultController) {
    if (this.batch.length > 0) {
      controller.enqueue(this.batch);
      this.batch = [];
    }
  }

  transform(chunk: any[], controller: TransformStreamDefaultController) {
    this.batch = this.batch.concat(chunk);
    if (this.batch.length >= this.batchSize) {
      controller.enqueue(this.batch);
      this.batch = [];
    }
  }
}
