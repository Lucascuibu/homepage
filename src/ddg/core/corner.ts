"use strict";
import Halfedge from "./halfedge";

export default class Corner {
	halfedge: Halfedge | undefined;
	index: number

	constructor() {
		this.halfedge = undefined;
		this.index = -1; // an ID between 0 and |C| - 1, where |C| is the number of corners in a mesh
	}

	get vertex() {
		return this.halfedge!.prev!.vertex;
	}

	get face() {
		return this.halfedge!.face;
	}

	get next() {
		return this.halfedge!.next!.corner;
	}

	get prev() {
		return this.halfedge!.prev!.corner;
	}

	toString() {
		return this.index;
	}
}
