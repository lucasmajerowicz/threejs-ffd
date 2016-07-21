import RenderingContext from './RenderingContext';
import DragComponent from './DragComponent';
import { dat } from '../../bin/dat.gui.min.js';

export default class MainView {
    constructor(controller) {
        this.controller = controller;
        this.renderingContext = this.createRenderingContext();
        this.dragComponent = new DragComponent(this.renderingContext, this);
        this.container = new THREE.Object3D();
        this.scene.add(this.container);
    }

    createRenderingContext() {
        const domContainer = document.createElement('div');

        document.body.appendChild(domContainer);

        return RenderingContext.getDefault(domContainer);
    }

    initialize() {
        this.initGUI();
        window.addEventListener( 'resize', (e) => this.onWindowResize(), false );
        window.addEventListener( 'keydown', (e) => this.onKeyPress(e), false );
        this.dragComponent.initialize();
        this.render();
    }

    render() {
        this.renderingContext.controls.update();
        requestAnimationFrame(() => this.render());

        this.renderingContext.renderer.render(this.renderingContext.scene, this.camera);
    }

    onWindowResize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderingContext.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    get scene() {
        return this.renderingContext.scene;
    }

    get camera() {
        return this.renderingContext.camera;
    }

    get renderer() {
        return this.renderingContext.renderer;
    }

    addDraggableObject(object) {
        this.container.add(object);
        this.dragComponent.addObject(object);
    }

    addObject(object) {
        this.container.add(object);
    }

    clearObjects() {
        this.removeTransformControl();
        this.scene.remove(this.container);
        this.dragComponent.clearObjects();
        this.container = new THREE.Object3D();
        this.scene.add(this.container);
    }

    initGUI() {
        this.uiSettings = {
            mesh: 'sphere',
            editLattice: false,
            showTransformControls: true,
            vertexSize: 1,
            divisions: 1,
            showLattice: true
        };
        const gui = new dat.GUI();

        gui.add( this.uiSettings, "mesh", ['sphere', 'dog', 'stayPuft'] ).onChange( () => this.controller.setModel(this.uiSettings.mesh));
        gui.add( this.uiSettings, "showLattice", true ).onChange( () => this.controller.onShowLatticeChange(this.uiSettings.showLattice));
        gui.add( this.uiSettings, "showTransformControls", true ).onChange( () => {
            if (this.uiSettings.showTransformControls) {
                this.addTransformControl(this.controller.lattice.latticeMesh);
            } else {
                this.removeTransformControl();
            }
        });
        gui.add( this.uiSettings, "editLattice", true ).onChange( () => this.controller.onEditLatticeChange(this.uiSettings.editLattice));
        gui.add( this.uiSettings, "vertexSize", 1, 5 ).onChange( () => this.controller.setLatticeVertexSize(this.uiSettings.vertexSize));
        gui.add( this.uiSettings, "divisions", [1, 2, 3] ).onChange( () => {
            this.clearObjects();
            this.controller.reloadModel()
        });
    }

    onObjectClicked(object, shiftKey, ctrlKey) {
        this.controller.onControlPointSelect(object, shiftKey, ctrlKey);
    }

    onKeyPress(event) {
        if (this.control) {
            switch (event.keyCode) {
                case 87: // W
                    this.control.setMode("translate");
                    break;

                case 69: // E
                    this.control.setMode("rotate");
                    break;

                case 82: // R
                    this.control.setMode("scale");
                    break;

                case 187:
                case 107: // +, =, num+
                    this.control.setSize(this.control.size + 0.1);
                    break;

                case 189:
                case 109: // -, _, num-
                    this.control.setSize(Math.max(this.control.size - 0.1, 0.1));
                    break;
            }
        }
    }

    addTransformControl(mesh) {
        this.control = new THREE.TransformControls( this.camera, this.renderer.domElement );
        this.control.addEventListener( 'change', () => this.render() );
        this.control.addEventListener( 'objectChange', () => {
            this.controller.lattice.updateControlPointsPosition();

            if (!this.uiSettings.editLattice) {
                this.controller.updateTargetVertices();
            }
        });

        this.control.attach( mesh );

        this.control.visible = this.uiSettings.showTransformControls;

        this.container.add( this.control );
    }

    removeTransformControl() {
        if (this.control) {
            this.control.detach();
            this.container.remove(this.control);
            this.control = null;
        }
    }
}