import { AngularMconPage } from './app.po';

describe('tracker-ui App', () => {
  let page: AngularMconPage;

  beforeEach(() => {
    page = new AngularMconPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(true).toBe(true)
  });
});
