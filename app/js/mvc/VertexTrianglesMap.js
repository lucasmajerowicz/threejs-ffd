export default class VertexTrianglesMap {
    constructor(geometry) {
        this.vertices = this.getVertexTrianglesMap(geometry);
    }

    getVertexTrianglesMap(geometry) {
        const vertices = [];

        for (let i = 0; i < geometry.numVertices; i++) {
            vertices.push([]);
        }

        for (let i = 0; i < geometry.numFaces; i++) {
            const face = geometry.getFace(i);
            const vertexA = geometry.getVertex(face.a);
            const vertexB = geometry.getVertex(face.b);
            const vertexC = geometry.getVertex(face.c);

            vertices[face.a].push([vertexA, vertexB, vertexC]);
            vertices[face.b].push([vertexB, vertexC, vertexA]);
            vertices[face.c].push([vertexC, vertexA, vertexB]);
        }

        return vertices;
    }

    get length() {
        return this.vertices.length;
    }

    getTriangles(index) {
        return this.vertices[index];
    }

}