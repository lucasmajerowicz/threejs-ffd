import UnIndexedBufferGeometryAdapter from './UnIndexedBufferGeometryAdapter';

export default class IndexedBufferGeometryAdapter extends UnIndexedBufferGeometryAdapter {
    constructor(bufferGeometry) {
        super(bufferGeometry);
        this.indices = bufferGeometry.index.array;
    }

    get numFaces() {
        return this.indices.length  / 3;
    }

    getFace(index) {
        const offsetPosition = 3 * index;

        return new THREE.Face3(this.indices[offsetPosition], this.indices[offsetPosition + 1], this.indices[offsetPosition + 2]);
    }

    getFaceVertices(index) {
        const offsetPosition = 3 * index;

        return {
            a: this.getVertex(this.indices[offsetPosition]),
            b: this.getVertex(this.indices[offsetPosition + 1]),
            c: this.getVertex(this.indices[offsetPosition + 2])
        }
    }

    updateFaces() {
        this.bufferGeometry.index.needsUpdate = true;
    }
}