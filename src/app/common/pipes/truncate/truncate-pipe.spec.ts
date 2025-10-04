import { TruncatePipe } from './truncate-pipe';

describe(TruncatePipe.name, () => {
  it('create an instance', () => {
    const pipe = new TruncatePipe();
    expect(pipe).toBeTruthy();
  });
});
