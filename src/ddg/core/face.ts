import Halfedge from './halfedge';
import Vertex from './vertex';
import Edge from './edge';
import Corner from './corner';


export default class Face {
	halfedge: Halfedge | undefined;
	index: number;

	constructor() {
		this.halfedge = undefined;
		this.index = -1;
	}

	isBoundaryLoop(): boolean {
		if (!this.halfedge) throw new Error("Halfedge cannot be undefined");
		return this.halfedge ? this.halfedge.onBoundary ?? false : false;
	}

	adjacentVertices(ccw: boolean = true): IterableIterator<Vertex> {
		return new FaceVertexIterator(this.halfedge, ccw);
	}

	adjacentEdges(ccw: boolean = true): IterableIterator<Edge> {
		return new FaceEdgeIterator(this.halfedge, ccw);
	}

	adjacentFaces(ccw: boolean = true): IterableIterator<Face> {
		if (!this.halfedge) throw new Error("Halfedge cannot be undefined");
		return new FaceFaceIterator(this.halfedge, ccw);
	}

	adjacentHalfedges(ccw: boolean = true): IterableIterator<Halfedge> {
		return new FaceHalfedgeIterator(this.halfedge, ccw);
	}

	adjacentCorners(ccw: boolean = true): IterableIterator<Corner | undefined> {
		return new FaceCornerIterator(this.halfedge, ccw);
	}

	toString(): string {
		return this.index.toString();
	}
}

class FaceVertexIterator implements IterableIterator<Vertex> {
	private _halfedge: Halfedge;
	private _ccw: boolean;
	private current: Halfedge;
	private end: Halfedge;
	private justStarted: boolean;

	constructor(halfedge: Halfedge | undefined, ccw: boolean) {
		if (!halfedge) throw new Error("Halfedge cannot be undefined");
		this._halfedge = halfedge;
		this._ccw = ccw;
		this.current = halfedge;
		this.end = halfedge;
		this.justStarted = true;
	}

	[Symbol.iterator](): IterableIterator<Vertex> {
		return this;
	}

	next(): IteratorResult<Vertex> {
		if (!this.justStarted && this.current === this.end) {
			return { done: true, value: undefined as any };
		} else {
			this.justStarted = false;
			let vertex = this.current.vertex;
			if (this._ccw) {
				if (!this.current.next) throw new Error("Halfedge must have next property");
				this.current = this.current.next;
			} else {
				if (!this.current.prev) throw new Error("Halfedge must have prev property");
				this.current = this.current.prev;
			}
			return { done: false, value: vertex as Vertex };
		}
	}


}

class FaceEdgeIterator implements IterableIterator<Edge> {
	private _halfedge: Halfedge;
	private _ccw: boolean;
	private current: Halfedge;
	private end: Halfedge;
	private justStarted: boolean;

	constructor(halfedge: Halfedge | undefined, ccw: boolean) {
		if (!halfedge) throw new Error("Halfedge cannot be undefined");
		this._halfedge = halfedge;
		this._ccw = ccw;
		this.current = halfedge;
		this.end = halfedge;
		this.justStarted = true;
	}

	[Symbol.iterator](): IterableIterator<Edge> {
		return this;
	}

	next(): IteratorResult<Edge> {
		if (!this.justStarted && this.current === this.end) {
			return { done: true, value: undefined as any };
		} else {
			this.justStarted = false;
			let edge = this.current.edge;
			if (this._ccw) {
				if (!this.current.next) throw new Error("Halfedge must have next property");
				this.current = this.current.next;
			} else {
				if (!this.current.prev) throw new Error("Halfedge must have prev property");
				this.current = this.current.prev;
			}
			return { done: false, value: edge as Edge };
		}
	}
}

class FaceFaceIterator implements IterableIterator<Face> {
	private _halfedge: Halfedge;
	private _ccw: boolean;
	private current: Halfedge;
	private end: Halfedge;
	private justStarted: boolean;

	constructor(halfedge: Halfedge, ccw: boolean) {
		while (halfedge.twin && halfedge.twin.onBoundary) {
			if (!halfedge.next) throw new Error("Halfedge must have next property");
			halfedge = halfedge.next;
		}
		this._halfedge = halfedge;
		this._ccw = ccw;
		this.current = halfedge;
		this.end = halfedge;
		this.justStarted = true;
	}

	[Symbol.iterator](): IterableIterator<Face> {
		return this;
	}

	next(): IteratorResult<Face> {
		while (this.current.twin && this.current.twin.onBoundary) {
			if (!this.current.next || !this.current.prev) throw new Error("Halfedge must have next property");
			this.current = this._ccw ? this.current.next : this.current.prev;
		}
		if (!this.justStarted && this.current === this.end) {
			return { done: true, value: undefined as any };
		} else {
			this.justStarted = false;
			let face = this.current.twin!.face;
			if (!this.current.next || !this.current.prev) throw new Error("Halfedge must have next property");
			this.current = this._ccw ? this.current.next : this.current.prev;
			return { done: false, value: face as Face };
		}
	}
}

class FaceHalfedgeIterator implements IterableIterator<Halfedge> {
	private _halfedge: Halfedge;
	private _ccw: boolean;
	private current: Halfedge;
	private end: Halfedge;
	private justStarted: boolean;

	constructor(halfedge: Halfedge | undefined, ccw: boolean) {
		if (!halfedge) throw new Error("Halfedge cannot be undefined");
		this._halfedge = halfedge;
		this._ccw = ccw;
		this.current = halfedge;
		this.end = halfedge;
		this.justStarted = true;
	}

	[Symbol.iterator](): IterableIterator<Halfedge> {
		return this;
	}

	next(): IteratorResult<Halfedge> {
		if (!this.justStarted && this.current === this.end) {
			return { done: true, value: undefined as any };
		} else {
			this.justStarted = false;
			let halfedge = this.current;
			if (!this.current.next || !this.current.prev) throw new Error("Halfedge must have next property");
			this.current = this._ccw ? this.current.next : this.current.prev;
			return { done: false, value: halfedge };
		}
	}
}

class FaceCornerIterator implements IterableIterator<Corner | undefined> {
	private _halfedge: Halfedge;
	private _ccw: boolean;
	private current: Halfedge;
	private end: Halfedge;
	private justStarted: boolean;

	constructor(halfedge: Halfedge | undefined, ccw: boolean) {
		if (!halfedge) throw new Error("Halfedge cannot be undefined");
		this._halfedge = halfedge;
		this._ccw = ccw;
		this.current = halfedge;
		this.end = halfedge;
		this.justStarted = true;
	}

	[Symbol.iterator](): IterableIterator<Corner | undefined> {
		return this;
	}

	next(): IteratorResult<Corner | undefined> {
		if (!this.justStarted && this.current === this.end) {
			return { done: true, value: undefined as any };
		} else {
			this.justStarted = false;
			if (!this.current.next || !this.current.prev) throw new Error("Halfedge must have next property");
			this.current = this._ccw ? this.current.next : this.current.prev;
			let corner = this.current.corner;
			return { done: false, value: corner };
		}
	}
}



// class Face {
// 	halfedge: Halfedge | undefined;
// 	index: number;
// 	/**
// 	 * This class represents a face in a {@link module:Core.Mesh Mesh}.
// 	 * @constructor module:Core.Face
// 	 * @property {module:Core.Halfedge} halfedge One of the halfedges associated with this face.
// 	 */
// 	constructor() {
// 		this.halfedge = undefined;
// 		this.index = -1; // an ID between 0 and |F| - 1 if this face is not a boundary loop
// 		// or an ID between 0 and |B| - 1 if this face is a boundary loop, where |F| is the
// 		// number of faces in the mesh and |B| is the number of boundary loops in the mesh
// 	}

// 	/**
// 	 * Checks whether this face is a boundary loop.
// 	 * @method module:Core.Face#isBoundaryLoop
// 	 * @returns {boolean}
// 	 */
// 	isBoundaryLoop() {
// 		return this.halfedge!.onBoundary;
// 	}

// 	/**
// 	 * Convenience function to iterate over the vertices in this face.
// 	 * Iterates over the vertices of a boundary loop if this face is a boundary loop.
// 	 * @method module:Core.Face#adjacentVertices
// 	 * @param {boolean} ccw A flag indicating whether iteration should be in CCW or CW order.
// 	 * @returns {module:Core.Vertex}
// 	 * @example
// 	 * let f = mesh.faces[0]; // or let b = mesh.boundaries[0]
// 	 * for (let v of f.adjacentVertices()) {
// 	 *     // Do something with v
// 	 * }
// 	 */
// 	adjacentVertices(ccw = true) {
// 		return new FaceVertexIterator(this.halfedge, ccw);
// 	}

// 	/**
// 	 * Convenience function to iterate over the edges in this face.
// 	 * Iterates over the edges of a boundary loop if this face is a boundary loop.
// 	 * @method module:Core.Face#adjacentEdges
// 	 * @param {boolean} ccw A flag indicating whether iteration should be in CCW or CW order.
// 	 * @returns {module:Core.Edge}
// 	 * @example
// 	 * let f = mesh.faces[0]; // or let b = mesh.boundaries[0]
// 	 * for (let e of f.adjacentEdges()) {
// 	 *     // Do something with e
// 	 * }
// 	 */
// 	adjacentEdges(ccw = true) {
// 		return new FaceEdgeIterator(this.halfedge, ccw);
// 	}

// 	/**
// 	 * Convenience function to iterate over the faces neighboring this face.
// 	 * @method module:Core.Face#adjacentFaces
// 	 * @param {boolean} ccw A flag indicating whether iteration should be in CCW or CW order.
// 	 * @returns {module:Core.Face}
// 	 * @example
// 	 * let f = mesh.faces[0]; // or let b = mesh.boundaries[0]
// 	 * for (let g of f.adjacentFaces()) {
// 	 *     // Do something with g
// 	 * }
// 	 */
// 	adjacentFaces(ccw = true) {
// 		return new FaceFaceIterator(this.halfedge, ccw);
// 	}

// 	/**
// 	 * Convenience function to iterate over the halfedges in this face.
// 	 * Iterates over the halfedges of a boundary loop if this face is a boundary loop.
// 	 * @method module:Core.Face#adjacentHalfedges
// 	 * @param {boolean} ccw A flag indicating whether iteration should be in CCW or CW order.
// 	 * @returns {module:Core.Halfedge}
// 	 * @example
// 	 * let f = mesh.faces[0]; // or let b = mesh.boundaries[0]
// 	 * for (let h of f.adjacentHalfedges()) {
// 	 *     // Do something with h
// 	 * }
// 	 */
// 	adjacentHalfedges(ccw = true) {
// 		return new FaceHalfedgeIterator(this.halfedge, ccw);
// 	}

// 	/**
// 	 * Convenience function to iterate over the corners in this face. Not valid if this face
// 	 * is a boundary loop.
// 	 * @method module:Core.Face#adjacentCorners
// 	 * @param {boolean} ccw A flag indicating whether iteration should be in CCW or CW order.
// 	 * @returns {module:Core.Corner}
// 	 * @example
// 	 * let f = mesh.faces[0];
// 	 * for (let c of f.adjacentCorners()) {
// 	 *     // Do something with c
// 	 * }
// 	 */
// 	adjacentCorners(ccw = true) {
// 		return new FaceCornerIterator(this.halfedge, ccw);
// 	}

// 	/**
// 	 * Defines a string representation for this face as its index.
// 	 * @ignore
// 	 * @method module:Core.Face#toString
// 	 * @returns {string}
// 	 */
// 	toString() {
// 		return this.index;
// 	}
// }

// /**
//  * This class represents an adjacent vertex iterator for a {@link module:Core.Face Face}.
//  * @ignore
//  * @memberof module:Core
//  */
// class FaceVertexIterator {
// 	_halfedge: Halfedge;
// 	_ccw: any;
// 	// constructor
// 	constructor(halfedge, ccw) {
// 		this._halfedge = halfedge;
// 		this._ccw = ccw;
// 	}

// 	[Symbol.iterator]() {
// 		return {
// 			current: this._halfedge,
// 			end: this._halfedge,
// 			ccw: this._ccw,
// 			justStarted: true,
// 			next() {
// 				if (!this.justStarted && this.current === this.end) {
// 					return {
// 						done: true
// 					};

// 				} else {
// 					this.justStarted = false;
// 					let vertex = this.current.vertex;
// 					this.current = this.ccw ? this.current.next : this.current.prev;
// 					return {
// 						done: false,
// 						value: vertex
// 					}
// 				}
// 			}
// 		}
// 	}
// }

// /**
//  * This class represents an adjacent edge iterator for a {@link module:Core.Face Face}.
//  * @ignore
//  * @memberof module:Core
//  */
// class FaceEdgeIterator {
// 	_halfedge: Halfedge;
// 	_ccw: any;
// 	// constructor
// 	constructor(halfedge, ccw) {
// 		this._halfedge = halfedge;
// 		this._ccw = ccw;
// 	}

// 	[Symbol.iterator]() {
// 		return {
// 			current: this._halfedge,
// 			end: this._halfedge,
// 			ccw: this._ccw,
// 			justStarted: true,
// 			next() {
// 				if (!this.justStarted && this.current === this.end) {
// 					return {
// 						done: true
// 					};

// 				} else {
// 					this.justStarted = false;
// 					let edge = this.current.edge;
// 					this.current = this.ccw ? this.current.next : this.current.prev;
// 					return {
// 						done: false,
// 						value: edge
// 					}
// 				}
// 			}
// 		}
// 	}
// }

// /**
//  * This class represents an adjacent face iterator for a {@link module:Core.Face Face}.
//  * @ignore
//  * @memberof module:Core
//  */
// class FaceFaceIterator {
// 	_halfedge: any;
// 	_ccw: any;
// 	// constructor
// 	constructor(halfedge, ccw) {
// 		while (halfedge.twin.onBoundary) {
// 			halfedge = halfedge.next;
// 		} // twin halfedge must not be on the boundary
// 		this._halfedge = halfedge;
// 		this._ccw = ccw;
// 	}

// 	[Symbol.iterator]() {
// 		return {
// 			current: this._halfedge,
// 			end: this._halfedge,
// 			ccw: this._ccw,
// 			justStarted: true,
// 			next() {
// 				while (this.current.twin.onBoundary) {
// 					this.current = this.ccw ? this.current.next : this.current.prev;
// 				} // twin halfedge must not be on the boundary
// 				if (!this.justStarted && this.current === this.end) {
// 					return {
// 						done: true
// 					};

// 				} else {
// 					this.justStarted = false;
// 					let face = this.current.twin.face;
// 					this.current = this.ccw ? this.current.next : this.current.prev;
// 					return {
// 						done: false,
// 						value: face
// 					}
// 				}
// 			}
// 		}
// 	}
// }

// /**
//  * This class represents an adjacent halfedge iterator for a {@link module:Core.Face Face}.
//  * @ignore
//  * @memberof module:Core
//  */
// class FaceHalfedgeIterator {
// 	_halfedge: any;
// 	_ccw: any;
// 	// constructor
// 	constructor(halfedge, ccw) {
// 		this._halfedge = halfedge;
// 		this._ccw = ccw;
// 	}

// 	[Symbol.iterator]() {
// 		return {
// 			current: this._halfedge,
// 			end: this._halfedge,
// 			ccw: this._ccw,
// 			justStarted: true,
// 			next() {
// 				if (!this.justStarted && this.current === this.end) {
// 					return {
// 						done: true
// 					};

// 				} else {
// 					this.justStarted = false;
// 					let halfedge = this.current;
// 					this.current = this.ccw ? this.current.next : this.current.prev;
// 					return {
// 						done: false,
// 						value: halfedge
// 					}
// 				}
// 			}
// 		}
// 	}
// }

// /**
//  * This class represents an adjacent corner iterator for a {@link module:Core.Face Face}.
//  * @ignore
//  * @memberof module:Core
//  */
// class FaceCornerIterator {
// 	_halfedge: any;
// 	_ccw: any;
// 	// constructor
// 	constructor(halfedge, ccw) {
// 		this._halfedge = halfedge;
// 		this._ccw = ccw;
// 	}

// 	[Symbol.iterator]() {
// 		return {
// 			current: this._halfedge,
// 			end: this._halfedge,
// 			ccw: this._ccw,
// 			justStarted: true,
// 			next() {
// 				if (!this.justStarted && this.current === this.end) {
// 					return {
// 						done: true
// 					};

// 				} else {
// 					this.justStarted = false;
// 					this.current = this.ccw ? this.current.next : this.current.prev;
// 					let corner = this.current.corner; // corner will be undefined if this face is a boundary loop
// 					return {
// 						done: false,
// 						value: corner
// 					}
// 				}
// 			}
// 		}
// 	}
// }