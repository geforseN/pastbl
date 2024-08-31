export class EmoteIntegrationContainer {
  constructor(private readonly element: HTMLElement) {}

  static fromClosestOf(target: HTMLImageElement) {
    const element = target.closest("[data-integration-source]");
    assert.ok(element instanceof HTMLElement);
    return new EmoteIntegrationContainer(element);
  }

  get integrationSource() {
    const source = this.element.dataset.integrationSource;
    assert.ok(allEmoteSources.has(source));
    return source;
  }
}
