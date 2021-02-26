class Controller {

  /**
   * 获得元素上得绑定得值
   */
  getDataSet(event, key) {
    return event.currentTarget.dataset[key];
  }

}

export { Controller };