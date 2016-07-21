import GeometryAdapterFactory from './adapter/GeometryAdapterFactory';
import Observable from './Observable';

const adapterFactory = new GeometryAdapterFactory();

export default class Lattice extends Observable {
    constructor(geometry,numDivisions) {
        super();
        this.geometry = geometry;
        this.numDivisions = numDivisions;
        this.makeLatticeObject();
        this.controlPoints = this.getControlPoints();
    }

    getBoundingBox() {
        const bbox = new THREE.Box3().setFromObject(this.latticeMesh);

        return bbox;
    }

    makeLatticeObject() {
        const bbox = this.geometry.getBoundingBox();

        this.size = bbox.max.clone().sub(bbox.min);
        const center = bbox.min.clone().add(this.size.clone().divideScalar(2));

        this.size.multiplyScalar(1.1);

        const latticeBoxGeometry = new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z, this.numDivisions, this.numDivisions, this.numDivisions);

        latticeBoxGeometry.translate(center.x, center.y, center.z);

        this.latticeMesh = new THREE.Mesh(latticeBoxGeometry, new THREE.MeshBasicMaterial({color: 0x333333, wireframe: true, wireframeLinewidth: 1 }));
        this.latticeGeometry = adapterFactory.getAdapter(latticeBoxGeometry);
    }

    getControlPoints() {
        const objects = [];

        for (let vertexIndex = 0; vertexIndex < this.latticeGeometry.numVertices; vertexIndex++) {
            const mesh = this.getControlPointMesh(vertexIndex);

            objects.push(mesh);
        }

        const bbox = this.getBoundingBox();

        const planes = [];
        planes.push(this.getPointsOnPlane(objects, bbox.min.x, null , null));
        planes.push(this.getPointsOnPlane(objects, bbox.max.x, null , null));
        planes.push(this.getPointsOnPlane(objects, null , bbox.min.y, null));
        planes.push(this.getPointsOnPlane(objects, null , bbox.max.y, null));
        planes.push(this.getPointsOnPlane(objects, null , null , bbox.min.z));
        planes.push(this.getPointsOnPlane(objects, null , null , bbox.max.z));

        for (const controlPoints of planes) {
            for (const controlPoint of controlPoints) {
                for (const controlPointAdjacent of controlPoints) {
                    controlPoint.adjacentPoints.add(controlPointAdjacent);
                }
            }
        }

        return objects;
    }

    getPointsOnPlane(controlPoints, x, y, z) {
        const delta = 0.1;
        const result = [];
        for (const controlPoint of controlPoints) {
            if (
                (!x || Math.abs(controlPoint.position.x - x) < delta)
            &&  (!y || Math.abs(controlPoint.position.y - y) < delta)
            &&  (!z || Math.abs(controlPoint.position.z - z) < delta)
            ) {
                result.push(controlPoint);
            }
        }

        return result;
    }

    updateControlPointsPosition() {
        for (const controlPoint of this.controlPoints) {
            controlPoint.position.copy(this.getVertex(controlPoint.vertexIndex));
        }
    }

    getWorldPositon(position) {
        return this.latticeMesh.localToWorld(position.clone())
    }

    getLocalPositon(position) {
        return this.latticeMesh.worldToLocal(position.clone())
    }

    getVertex(vertexIndex) {
        const position = this.latticeGeometry.getVertex(vertexIndex);

        return this.getWorldPositon(position);
    }

    get numVertices() {
        return this.latticeGeometry.numVertices;
    }

    get numFaces() {
        return this.latticeGeometry.numFaces;
    }

    getFace(i) {
        return this.latticeGeometry.getFace(i);
    }

    getControlPointMesh(vertexIndex) {
        const vertex = this.latticeGeometry.getVertex(vertexIndex);
        const box = new THREE.SphereGeometry(0.1, 32, 32);
        const mesh = new THREE.Mesh(box, Lattice.ControlPointMaterial);

        mesh.position.copy(vertex);
        mesh.vertexIndex = vertexIndex;
        mesh.adjacentPoints = new Set();

        mesh.onDrag = () => {
            const delta = mesh.position.clone().sub(this.getVertex(vertexIndex));

            this.emit('onDrag', { delta, object: mesh });
        };

        return mesh;
    }

    set isVisible(visible) {
        this.latticeMesh.visible = visible;

        this.controlPointsVisible = visible;
    }

    set controlPointsVisible(visible) {
        for (const controlPoint of this.controlPoints) {
            controlPoint.visible = visible;
        }
    }
}

Lattice.ControlPointMaterial = new THREE.MeshStandardMaterial({
    color: 'black',
    emissive: 0,
    metalness: 0.2,
    side: 2,
    roughness: 0.5
});

Lattice.SelectedControlPointMaterial = new THREE.MeshStandardMaterial({
    color: 'green',
    emissive: 0,
    metalness: 0.2,
    side: 2,
    roughness: 0.5
});