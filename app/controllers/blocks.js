import AbstractController from '.';

export default class BlocksController extends AbstractController {
  initRouter() {
    this.router.get('/blocks', BlocksController.listBlocks);
    this.router.post('/blocks');
  }
}
