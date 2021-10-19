export class ValueDto<TValue> {
  value: TValue;

  constructor(value: TValue) {
    this.value = value;
  }
}
