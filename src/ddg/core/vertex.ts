"use strict";
import Halfedge from "./halfedge";


export default class Vertex {
	halfedge: Halfedge | undefined;
	index: number;

	constructor() {
		this.halfedge = undefined;
		this.index = -1; // an ID between 0 and |V| - 1, where |V| is the number of vertices in a mesh
	}

	degree() {
		let k = 0;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		for (let _e of this.adjacentEdges()) k++;
		return k;
	}

	isIsolated() {
		return this.halfedge === undefined;
	}

	onBoundary() {
		for (let h of this.adjacentHalfedges()) {
			if (h!.onBoundary) {
				return true;
			}
		}

		return false;
	}

	adjacentVertices(ccw = true) {
		if (this.halfedge === undefined) {
			return {
				[Symbol.iterator]: function* () {
					yield;
				}
			}
		}
		return new VertexVertexIterator(this.halfedge, ccw);
	}

	adjacentEdges(ccw = true) {
		if (this.halfedge == undefined) {
			return {
				[Symbol.iterator]: function* () {
					yield;
				}
			}
		}
		return new VertexEdgeIterator(this.halfedge, ccw);
	}

	adjacentFaces(ccw = true) {
		if (this.halfedge === undefined) {
			return {
				[Symbol.iterator]: function* () {
					yield;
				}
			}
		}
		return new VertexFaceIterator(this.halfedge, ccw);
	}

	adjacentHalfedges(ccw = true) {
		if (this.halfedge === undefined) {
			return {
				[Symbol.iterator]: function* () {
					yield;
				}
			}
		}
		return new VertexHalfedgeIterator(this.halfedge, ccw); // outgoing halfedges
	}

	adjacentCorners(ccw = true) {
		if (this.halfedge === undefined) {
			return {
				[Symbol.iterator]: function* () {
					yield; // Add a yield statement here
				}
			}
		}
		return new VertexCornerIterator(this.halfedge, ccw);
	}

	toString() {
		return this.index;
	}
}

class VertexVertexIterator {
	_halfedge: Halfedge;
	_ccw: boolean;
	// constructor
	constructor(halfedge: Halfedge, ccw: boolean) {
		this._halfedge = halfedge;
		this._ccw = ccw;
	}

	[Symbol.iterator]() {
		return {
			current: this._halfedge,
			end: this._halfedge,
			ccw: this._ccw,
			justStarted: true,
			next() {
				if (!this.justStarted && this.current === this.end) {
					return {
						done: true
					};

				} else {
					this.justStarted = false;
					let vertex = this.current.twin!.vertex;
					if (this.current.twin!.next === undefined || this.current.prev!.twin === undefined) {
						throw new Error("Halfedge twin is undefined");
					}
					this.current = this.ccw ? this.current.twin!.next : this.current.prev!.twin;
					return {
						done: false,
						value: vertex
					}
				}
			}
		}
	}
}

/**
 * This class represents an adjacent edge iterator for a {@link module:Core.Vertex Vertex}.
 * @ignore
 * @memberof module:Core
 */
class VertexEdgeIterator {
	_halfedge: Halfedge;
	_ccw: boolean;
	// constructor
	constructor(halfedge: Halfedge, ccw: boolean) {
		this._halfedge = halfedge;
		this._ccw = ccw;
	}

	[Symbol.iterator]() {
		return {
			current: this._halfedge,
			end: this._halfedge,
			ccw: this._ccw,
			justStarted: true,
			next() {
				if (!this.justStarted && this.current === this.end) {
					return {
						done: true
					};

				} else {
					this.justStarted = false;
					let edge = this.current.edge;
					if (this.current.twin!.next === undefined || this.current.prev!.twin === undefined) {
						throw new Error("Halfedge twin is undefined");
					}
					this.current = this.ccw ? this.current.twin!.next : this.current.prev!.twin;
					return {
						done: false,
						value: edge
					}
				}
			}
		}
	}
}

/**
 * This class represents an adjacent face iterator for a {@link module:Core.Vertex Vertex}.
 * @ignore
 * @memberof module:Core
 */
class VertexFaceIterator {
	_halfedge: Halfedge;
	_ccw: boolean;
	// constructor
	constructor(halfedge: Halfedge, ccw: boolean) {
		while (halfedge.onBoundary) {
			if (halfedge.twin === undefined || halfedge.twin.next === undefined) {
				throw new Error("Halfedge twin is undefined");
			}
			halfedge = halfedge.twin!.next;
		} // halfedge must not be on the boundary
		this._halfedge = halfedge;
		this._ccw = ccw;
	}

	[Symbol.iterator]() {
		return {
			current: this._halfedge,
			end: this._halfedge,
			ccw: this._ccw,
			justStarted: true,
			next() {
				while (this.current.onBoundary) {
					if (this.current.twin!.next === undefined || this.current.prev!.twin === undefined) {
						throw new Error("Halfedge twin is undefined");
					}
					this.current = this.ccw ? this.current.twin!.next : this.current.prev!.twin;
				} // halfedge must not be on the boundary
				if (!this.justStarted && this.current === this.end) {
					return {
						done: true
					};

				} else {
					this.justStarted = false;
					let face = this.current.face;
					if (this.current.twin!.next === undefined || this.current.prev!.twin === undefined) {
						throw new Error("Halfedge twin is undefined");
					}
					this.current = this.ccw ? this.current.twin!.next : this.current.prev!.twin;
					return {
						done: false,
						value: face
					}
				}
			}
		}
	}
}

/**
 * This class represents an adjacent halfedge iterator for a {@link module:Core.Vertex Vertex}.
 * @ignore
 * @memberof module:Core
 */
class VertexHalfedgeIterator {
	_halfedge: Halfedge;
	_ccw: boolean;
	// constructor
	constructor(halfedge: Halfedge | undefined, ccw: boolean) {
		if (halfedge === undefined) {
			throw new Error("Halfedge is undefined");
		}
		this._halfedge = halfedge;
		this._ccw = ccw;
	}

	[Symbol.iterator]() {
		return {
			current: this._halfedge,
			end: this._halfedge,
			ccw: this._ccw,
			justStarted: true,
			next() {
				if (!this.justStarted && this.current === this.end) {
					return {
						done: true
					};

				} else {
					this.justStarted = false;
					let halfedge = this.current;
					if (this.current.twin!.next === undefined || this.current.prev!.twin === undefined) {
						throw new Error("Halfedge twin is undefined");
					}
					this.current = this.ccw ? this.current.twin!.next : this.current.prev!.twin;
					return {
						done: false,
						value: halfedge
					}
				}
			}
		}
	}
}

/**
 * This class represents an adjacent corner iterator for a {@link module:Core.Vertex Vertex}.
 * @ignore
 * @memberof module:Core
 */
class VertexCornerIterator {
	_halfedge: Halfedge;
	_ccw: boolean;
	// constructor
	constructor(halfedge: Halfedge, ccw: boolean) {
		while (halfedge.onBoundary) {
			if (halfedge.twin === undefined || halfedge.twin.next === undefined) {
				throw new Error("Halfedge twin is undefined");
			}
			halfedge = halfedge.twin.next;
		} // halfedge must not be on the boundary
		this._halfedge = halfedge;
		this._ccw = ccw;
	}

	[Symbol.iterator]() {
		return {
			current: this._halfedge,
			end: this._halfedge,
			ccw: this._ccw,
			justStarted: true,
			next() {
				while (this.current.onBoundary) {
					if (this.current.twin!.next === undefined || this.current.prev!.twin === undefined) {
						throw new Error("Halfedge twin is undefined");
					}
					this.current = this.ccw ? this.current.twin!.next : this.current.prev!.twin;
				} // halfedge must not be on the boundary
				if (!this.justStarted && this.current === this.end) {
					return {
						done: true
					};

				} else {
					this.justStarted = false;
					let corner = this.current.next!.corner;
					if (this.current.twin!.next === undefined || this.current.prev!.twin === undefined) {
						throw new Error("Halfedge twin is undefined");
					}
					this.current = this.ccw ? this.current.twin!.next : this.current.prev!.twin;
					return {
						done: false,
						value: corner
					}
				}
			}
		}
	}
}