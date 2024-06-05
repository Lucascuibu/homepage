"use strict";
import EmscriptenMemoryManager from "./emscripten-memory-manager";

export default class Complex {
	memoryManager: EmscriptenMemoryManager;
	data: Complex;
	private _real: number;
	private _imag: number;

	/**
	 * This class represents a complex number a + bi.
	 * @constructor module:LinearAlgebra.Complex
	 * @param {number} re The real component of this complex number.
	 * @param {number} im The imaginary component of this complex number.
	 */
	constructor(re = 0, im = 0) {
		this._real = re;
		this._imag = im;
		this.data = this;  // Assuming `data` refers to the current instance
		this.memoryManager = new EmscriptenMemoryManager();
		this.memoryManager.objectList.push(this);
	}

	/**
	 * Deletes the emscripten heap allocated data of this complex number.
	 * @method module:LinearAlgebra.Complex#delete
	 * @ignore
	 */
	delete(): void {
		// Assuming `data` has a delete method
		this.memoryManager.objectList = this.memoryManager.objectList.filter(obj => obj !== this);
	}

	/**
	 * The real component of this complex number.
	 * @member module:LinearAlgebra.Complex#re
	 * @type {number}
	 */
	get re(): number {
		return this._real;
	}

	/**
	 * The imaginary component of this complex number.
	 * @member module:LinearAlgebra.Complex#im
	 * @type {number}
	 */
	get im(): number {
		return this._imag;
	}

	/**
	 * Computes the phase angle of this complex number.
	 * @method module:LinearAlgebra.Complex#arg
	 * @returns {number}
	 */
	arg(): number {
		return Math.atan2(this.im, this.re);
	}


	/**
	 * Computes the norm of this complex number.
	 * @method module:LinearAlgebra.Complex#norm
	 * @returns {number}
	 */
	norm(): number {
		return Math.sqrt(this.norm2());
	}

	/**
	 * Computes the squared norm of this complex number.
	 * @method module:LinearAlgebra.Complex#norm2
	 * @returns {number}
	 */
	norm2(): number {
		return this.re * this.re + this.im * this.im;
	}

	/**
	 * Computes a - bi
	 * @method module:LinearAlgebra.Complex#conjugate
	 * @returns {module:LinearAlgebra.Complex}
	 */
	conjugate(): Complex {
		return new Complex(this.re, -this.im);
	}

	/**
	 * Computes (a + bi)^-1
	 * @method module:LinearAlgebra.Complex#inverse
	 * @returns {module:LinearAlgebra.Complex}
	 */
	inverse(): Complex {
		return this.conjugate().overReal(this.norm2());
	}

	/**
	 * Computes the polar form ae^(iθ), where a is the norm and θ is the
	 * phase angle of this complex number.
	 * @method module:LinearAlgebra.Complex#polar
	 * @returns {module:LinearAlgebra.Complex}
	 */
	polar(): Complex {
		let a = this.norm();
		let theta = this.arg();

		return new Complex(Math.cos(theta) * a, Math.sin(theta) * a);
	}

	/**
	 * Exponentiates this complex number.
	 * @method module:LinearAlgebra.Complex#exp
	 * @returns {module:LinearAlgebra.Complex}
	 */
	exp(): Complex {
		let a = Math.exp(this.re);
		let theta = this.im;

		return new Complex(Math.cos(theta) * a, Math.sin(theta) * a);
	}

	/**
	 * Returns u + v
	 * @method module:LinearAlgebra.Complex#plus
	 * @param {module:LinearAlgebra.Complex} v The complex number added to this complex number.
	 * @return {module:LinearAlgebra.Complex}
	 */
	plus(v:Complex): Complex {
		return new Complex(this.re + v.re, this.im + v.im);
	}

	/**
	 * Returns u - v
	 * @method module:LinearAlgebra.Complex#minus
	 * @param {module:LinearAlgebra.Complex} v The complex number subtracted from this complex number.
	 * @return {module:LinearAlgebra.Complex}
	 */
	minus(v:Complex): Complex {
		return new Complex(this.re - v.re, this.im - v.im);
	}

	/**
	 * Returns u * s
	 * @method module:LinearAlgebra.Complex#timesReal
	 * @param {number} s The number this complex number is multiplied by.
	 * @return {module:LinearAlgebra.Complex}
	 */
	timesReal(s:number): Complex {
		return new Complex(this.re * s, this.im * s);
	}

	/**
	 * Returns u / s
	 * @method module:LinearAlgebra.Complex#overReal
	 * @param {number} s The number this complex number is divided by.
	 * @return {module:LinearAlgebra.Complex}
	 */
	overReal(s:number): Complex {
		return this.timesReal(1 / s);
	}

	/**
	 * Returns u * v
	 * @method module:LinearAlgebra.Complex#timesComplex
	 * @param {module:LinearAlgebra.Complex} v The complex number this complex number is multiplied by.
	 * @return {module:LinearAlgebra.Complex}
	 */
	timesComplex(v:Complex): Complex {
		let a = this.re;
		let b = this.im;
		let c = v.re;
		let d = v.im;

		let re = a * c - b * d;
		let im = a * d + b * c;

		return new Complex(re, im);
	}

	/**
	 * Returns u / v
	 * @method module:LinearAlgebra.Complex#overComplex
	 * @param {module:LinearAlgebra.Complex} v The complex number this complex number is divided by.
	 * @return {module:LinearAlgebra.Complex}
	 */
	overComplex(v:Complex): Complex {
		return this.timesComplex(v.inverse());
	}
}
