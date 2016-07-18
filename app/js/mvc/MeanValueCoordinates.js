import VertexTrianglesMap from './VertexTrianglesMap';
import CoordinateCalculator from './CoordinateCalculator';

export default class MeanValueCoordinates {
    constructor(lattice) {
        this.lattice = lattice;
        this.trianglesByVertex = new VertexTrianglesMap(this.lattice);
        this.coordinateCalculator = new CoordinateCalculator();
    }

    getCoordinates(vertex) {
        const result = [];
        let sum = 0;

        for (let vertexIndex = 0; vertexIndex < this.trianglesByVertex.length; vertexIndex++) {
            const boundaryVertex = this.lattice.getVertex(vertexIndex);
            const triangles = this.trianglesByVertex.getTriangles(vertexIndex);
            const coordinate = this.coordinateCalculator.getCoordinate(vertex, boundaryVertex, triangles);

            result.push(coordinate);
            sum += coordinate;
        }

        for (let i = 0; i < result.length; i++) {
            result[i] /= sum;
        }

        return result;
    }

    evaluate(coordinates) {
        const result = new THREE.Vector3();
        let total = 0;

        for (let vertexIndex = 0; vertexIndex < coordinates.length; vertexIndex++) {
            const coefficient = coordinates[vertexIndex];

            if (coefficient > 0) {
                const boundaryVertex = this.lattice.getVertex(vertexIndex);

                result.add(boundaryVertex.clone().multiplyScalar(coefficient));
                total += coefficient;
            }
        }

        result.divideScalar(total);

        return result;
    }
}