export default class UnIndexedBufferGeometryAdapter {

    constructor(bufferGeometry) {
        this.bufferGeometry = bufferGeometry;
        this.positions = bufferGeometry.attributes.position.array;
    }

    get numVertices() {
        return this.positions.length / 3;
    }

    get numFaces() {
        return this.numVertices;
    }

    setVertex(index, x, y, z) {
        const offsetPosition = 3 * index;

        this.positions[offsetPosition] = x;
        this.positions[offsetPosition + 1] = y;
        this.positions[offsetPosition + 2] = z;
    }

    setVertexX(index, x) {
        this.positions[3 * index] = x;
    }

    setVertexY(index, y) {
        this.positions[3 * index + 1] = y;
    }

    setVertexZ(index, z) {
        this.positions[3 * index + 2] = z;
    }

    getVertex(index) {
        const offsetPosition = 3 * index;

        return new THREE.Vector3(this.positions[offsetPosition], this.positions[offsetPosition + 1], this.positions[offsetPosition + 2]);
    }

    getVertexX(index) {
        return this.positions[3 * index];
    }

    getVertexY(index) {
        return this.positions[3 * index + 1];
    }

    getVertexZ(index) {
        return this.positions[3 * index + 2];
    }

    getFace(index) {
        const offsetPosition = 3 * index;

        return new THREE.Face3(offsetPosition, offsetPosition + 1, offsetPosition + 2);
    }

    getFaceVertices(index) {
        const offsetPosition = 3 * index;

        return {
            a: this.getVertex(offsetPosition),
            b: this.getVertex(offsetPosition + 1),
            c: this.getVertex(offsetPosition + 2)
        }
    }

    updateVertices() {
        this.bufferGeometry.attributes.position.needsUpdate = true;
        this.bufferGeometry.attributes.normal.needsUpdate = true;
        this.bufferGeometry.computeVertexNormals();
    }

    updateFaces() {
        this.updateVertices();
    }

    getBoundingBox() {
        this.bufferGeometry.computeBoundingBox();

        return this.bufferGeometry.boundingBox;
    }

}