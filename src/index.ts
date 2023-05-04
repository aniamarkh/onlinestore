import './global.css';
import { Controller } from './components/controller/controller';
import { Model } from './components/model/model';
import { View } from './components/view/view';
import plants from './components/model/plants';

const model = new Model(plants);
const view = new View();
const controller = new Controller(model, view);

controller.init();