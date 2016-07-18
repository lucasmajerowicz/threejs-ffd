import IndexedBufferGeometryAdapter from './IndexedBufferGeometryAdapter';
import UnIndexedBufferGeometryAdapter from './UnIndexedBufferGeometryAdapter';
import GeometryAdapter from './GeometryAdapter';

export default class GeometryAdapterFactory {

    getAdapter(geometry) {
        const hasPositionAtrr = geometry.attributes && geometry.attributes.position;

        if (hasPositionAtrr) {
            if (geometry.index) {
                return new IndexedBufferGeometryAdapter(geometry);
            } else {
                return new UnIndexedBufferGeometryAdapter(geometry);
            }
        } else {
            return new GeometryAdapter(geometry);
        }
    }
}