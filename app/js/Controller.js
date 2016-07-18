import MainView from './view/MainView';
import GeometryAdapterFactory from './adapter/GeometryAdapterFactory';
import MeanValueCoordinates from './mvc/MeanValueCoordinates';
import Lattice from './view/Lattice';
import '../bin/STLLoader';

const material = new THREE.MeshLambertMaterial( {
    color: 0x666666
});
const loader = new THREE.STLLoader();
const adapterFactory = new GeometryAdapterFactory();

export default class Controller {
    constructor() {
        this.currentModel = 'sphere';
        this.view = new MainView(this);
        this.view.initialize();
        this.selectedControlPoints = new Set();

        this.initialize();
    }

    initialize() {
        this.reloadModel();
    }

    onShowLatticeChange(showLattice) {
        this.lattice.isVisible = showLattice;
        this.view.control.visible = showLattice;
    }

    setLatticeVertexSize(size) {
        for (const controlPoint of this.lattice.controlPoints) {
            controlPoint.scale.x = size;
            controlPoint.scale.y = size;
            controlPoint.scale.z = size;
        }
    }

    onEditLatticeChange(editLattice) {
        if (!editLattice) {
            this.setupLattice();
        }
    }

    onControlPointSelect(object, shiftKey, ctrlKey) {
         if (!this.selectedControlPoints.has(object)) {
            if (!shiftKey) {
                this.clearSelection();
            }
            this.selectedControlPoints.add(object);
            object.material = Lattice.SelectedControlPointMaterial.clone();
        }

        if (ctrlKey) {
            for (const neighborObject of object.adjacentPoints) {
                this.selectedControlPoints.add(neighborObject);
                neighborObject.material = Lattice.SelectedControlPointMaterial.clone();
            }
        }
    }

    clearSelection() {
        for (const controlPoint of this.selectedControlPoints) {
            controlPoint.material = Lattice.ControlPointMaterial.clone();
        }

        this.selectedControlPoints.clear();
    }

    setModel(model) {
        this.view.clearObjects();
        this.currentModel = model;
        this.reloadModel();
    }

    reloadModel() {
        this.getGeometryByIndex()
        .then((geometry) => {
            const mesh = new THREE.Mesh( geometry, material );
            this.view.addObject( mesh );

            this.geometryAdapter = adapterFactory.getAdapter(geometry);
            this.lattice = new Lattice(this.geometryAdapter, 2);

            this.view.addObject(this.lattice.latticeMesh);

            for (const controlPoint of this.lattice.controlPoints) {
                this.view.addDraggableObject(controlPoint);
            }

            this.setupLattice();
        });
    }

    getGeometryByIndex() {
        const index = this.currentModel;
        return new Promise( function (resolve, reject) {
            if (index == 'sphere') {
                resolve(new THREE.SphereBufferGeometry(3, 32, 32));
            } else {
                const fileName = (index == 'unicorn') ? 'dog.stl' : 'StayPuft.stl';
                loader.load('models/' + fileName, function (geometry) {
                    resolve(geometry);
                });
            }
        });
    }

    setupLattice() {
        this.mvc = new MeanValueCoordinates(this.lattice);
        this.coordinates = [];

        const latticeBundingBox = this.lattice.getBoundingBox();

        for (let vertexIndex = 0; vertexIndex < this.geometryAdapter.numVertices; vertexIndex++) {
            const v = this.geometryAdapter.getVertex(vertexIndex);
            const vertexCoordinates = latticeBundingBox.containsPoint(v) ?  this.mvc.getCoordinates(v) : null;

            this.coordinates.push(vertexCoordinates);
        }

        this.lattice.removeObserver('onDrag');
        this.lattice.addObserver('onDrag', (e) => this.onLatticeDrag(e));

        this.view.removeTransformControl();
        this.view.addTransformControl(this.lattice.latticeMesh);
    }

    onLatticeDrag(e) {
        const delta = e.delta;
        const object = e.object;

        for (const controlPoint of this.selectedControlPoints) {
            const newVertexPosition = this.lattice.getVertex(controlPoint.vertexIndex).clone().add(delta);
            const localPosition = this.lattice.getLocalPositon(newVertexPosition);

            this.lattice.latticeGeometry.setVertex(controlPoint.vertexIndex, localPosition.x, localPosition.y, localPosition.z);

            if (object != controlPoint) {
                controlPoint.position.copy(newVertexPosition);
            }
        }

        this.lattice.latticeGeometry.updateVertices();

        this.updateTargetVertices();
    }

    updateTargetVertices() {
        for (let vertexIndex = 0; vertexIndex < this.coordinates.length; vertexIndex++) {
            const vertexCoordinates = this.coordinates[vertexIndex];

            if (vertexCoordinates) {
                const position = this.mvc.evaluate(vertexCoordinates);

                this.geometryAdapter.setVertex(vertexIndex, position.x, position.y, position.z);
            }
        }

        this.geometryAdapter.updateVertices();
    }
}