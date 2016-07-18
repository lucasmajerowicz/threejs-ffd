export default class VertexTrianglesMap {
    constructor(lattice) {
        this.vertices = this.getVertexTrianglesMap(lattice);
    }

    getVertexTrianglesMap(lattice) {
        const vertices = [];

        for (let i = 0; i < lattice.numVertices; i++) {
            vertices.push([]);
        }

        for (let i = 0; i < lattice.numFaces; i++) {
            const face = lattice.getFace(i);
            const vertexA = lattice.getVertex(face.a);
            const vertexB = lattice.getVertex(face.b);
            const vertexC = lattice.getVertex(face.c);

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