export default class GeometryAdapter {

    constructor(geometry) {
        this.geometry = geometry;
    }

    get numVertices() {
        return this.geometry.vertices.length;
    }

    get numFaces() {
        return this.geometry.faces.length;
    }

    setVertex(index, x, y, z) {
        this.geometry.vertices[index].set(x, y, z);
    }

    setVertexX(index, x) {
        this.geometry.vertices[index].setX(x);
    }

    setVertexY(index, y) {
        this.geometry.vertices[index].setY(y);
    }

    setVertexZ(index, z) {
        this.geometry.vertices[index].setZ(z);
    }

    getVertex(index) {
        return this.geometry.vertices[index];
    }

    getVertexX(index) {
        return this.geometry.vertices[index].x;
    }

    getVertexY(index) {
        return this.geometry.vertices[index].y;
    }

    getVertexZ(index) {
        return this.geometry.vertices[index].z;
    }

    getFace(index) {
        return this.geometry.faces[index];
    }

    getFaceVertices(index) {
        const face = this.getFace(index);

        return {
            a: this.getVertex(face.a),
            b: this.getVertex(face.b),
            c: this.getVertex(face.c)
        }
    }

    updateVertices() {
        this.geometry.verticesNeedUpdate = true;
    }

    updateFaces() {
        this.geometry.elementsNeedUpdate = true;
    }
}