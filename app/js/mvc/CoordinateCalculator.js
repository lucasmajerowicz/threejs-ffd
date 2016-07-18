import Acos from './Acos';
const acos = new Acos();


export default class CoordinateCalculator {
    constructor() {
        this.vertexI = new THREE.Vector3();
        this.vertexJ = new THREE.Vector3();
        this.vertexK = new THREE.Vector3();
        this.iXj = new THREE.Vector3();
    }

    getCoordinate(vertex, boundaryVertex, triangles) {
        let wI = 0;

        for (let j = 0; j < triangles.length; j++) {
            wI += this.getPiFactor(vertex, triangles[j]);
        }

        return wI / vertex.distanceTo(boundaryVertex);
    }

    getPiFactor(v, triangle) {
        this.vertexI.copy(triangle[0]).sub(v).normalize();
        this.vertexJ.copy(triangle[1]).sub(v).normalize();
        this.vertexK.copy(triangle[2]).sub(v).normalize();

        const angleJK =  this.angleBetweenVectors(this.vertexJ, this.vertexK);
        const angleIJ = this.angleBetweenVectors(this.vertexI, this.vertexJ);
        const angleKI = this.angleBetweenVectors(this.vertexK, this.vertexI);

        this.iXj.copy(this.vertexI).cross(this.vertexJ);
        const nJK = this.vertexJ.cross(this.vertexK);
        const nKI = this.vertexK.cross(this.vertexI);

        nJK.normalize();

        return (angleJK + this.iXj.dot(nJK) * angleIJ / this.iXj.length() + nKI.dot(nJK) * angleKI / nKI.length()) / (this.vertexI.dot(nJK) * 2);
    }

    angleBetweenVectors (v, w) {
        var theta = v.dot( w ) / ( Math.sqrt( w.lengthSq() * v.lengthSq() ) );

        return acos.evaluate( THREE.Math.clamp( theta, - 1, 1 ) );
    }
}