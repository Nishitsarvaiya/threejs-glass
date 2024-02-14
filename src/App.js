import { Clock, SRGBColorSpace, Scene } from "three";
import { createCamera, createRenderer } from "./core-utils";
import { Text } from "troika-three-text";

const REGULAR_FONT = "/ClashDisplay-Regular.ttf";
const MEDIUM_FONT = "/ClashDisplay-Medium.ttf";

export default class App {
	static _renderer = this._renderer;
	static _camera = this._camera;
	static _scene = this._scene;
	static _controls = this._controls;
	static _canvas = this._canvas;
	static _clock = this._clock;
	static _vw = this._vw;
	static _vh = this._vh;

	constructor() {
		this.time = 0;
		this.initApp();
	}

	initApp() {
		// get the canvas container
		const container = document.getElementById("app");

		// Create the renderer
		this._renderer = createRenderer({ antialias: true }, (_ren) => {
			_ren.outputColorSpace = SRGBColorSpace;
		});
		this._canvas = this._renderer.domElement;
		container.appendChild(this._renderer.domElement);

		// set vw & vh
		this._vw = window.innerWidth;
		this._vh = window.innerHeight;
		this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this._renderer.setSize(this._vw, this._vh);

		// Create the scene
		this._scene = new Scene();

		// Create the camera
		this._camera = createCamera(75, 0.01, 1000);

		// Create the clock
		this._clock = new Clock();

		this.addListeners();
		this.resize();
		this._clock.start();
		this.raf = window.requestAnimationFrame(() => this.update());
		this.addObjects();
	}

	addObjects() {
		this.title = new Text();
		this.title.font = MEDIUM_FONT;
		this.title.text = "404";
		this.title.anchorX = "center";
		this.title.anchorY = "middle";
		this.title.textAlign = "center";

		this.subtitle = new Text();
		this.subtitle.font = REGULAR_FONT;
		this.subtitle.text = "this link is broken";
		this.subtitle.anchorX = "center";
		this.subtitle.letterSpacing = 0.05;
		this.subtitle.position.y = -1;

		this.title.fontSize = this._vw > 992 ? 1.86 : 1.2;
		this.subtitle.fontSize = this._vw > 576 ? 0.165 : 0.12;
		this.subtitle.position.y = this._vw > 992 ? -1 : -0.6;
		this.title.sync();
		this.subtitle.sync();

		this._scene.add(this.title);
		this._scene.add(this.subtitle);
	}

	update = () => {
		const elapsedTime = this._clock.getElapsedTime();
		this.raf = window.requestAnimationFrame(this.update);
		this.render();
	};

	render() {
		this._renderer.render(this._scene, this._camera);
	}

	resize() {
		this._vw = window.innerWidth;
		this._vh = window.innerHeight;
		this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this._renderer.setSize(this._vw, this._vh);
		this._camera.aspect = this._vw / this._vh;
		this._camera.updateProjectionMatrix();
		if (this.title && this.subtitle) {
			this.title.fontSize = this._vw > 992 ? 1.86 : 1.2;
			this.subtitle.fontSize = this._vw > 576 ? 0.165 : 0.12;
			this.subtitle.position.y = this._vw > 992 ? -1 : -0.6;
			this.title?.sync();
			this.subtitle?.sync();
		}
	}

	addListeners() {
		window.addEventListener("resize", () => this.resize());
	}
}
