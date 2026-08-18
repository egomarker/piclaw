import { h, render, Component, createContext, options } from "preact";
import {
  useState,
  useReducer,
  useEffect,
  useLayoutEffect,
  useRef,
  useImperativeHandle,
  useMemo,
  useCallback,
  useContext,
  useDebugValue,
  useErrorBoundary,
} from "preact/hooks";
import htm from "htm";

const html = htm.bind(h);

/** Preact equivalent of ReactDOM.flushSync for framework adapter callbacks. */
function flushSync<T>(callback: () => T): T {
  const previousDebounceRendering = options.debounceRendering;
  options.debounceRendering = (renderCallback) => renderCallback();
  try {
    return callback();
  } finally {
    options.debounceRendering = previousDebounceRendering;
  }
}

export {
  h,
  html,
  flushSync,
  render,
  Component,
  createContext,
  useState,
  useReducer,
  useEffect,
  useLayoutEffect,
  useRef,
  useImperativeHandle,
  useMemo,
  useCallback,
  useContext,
  useDebugValue,
  useErrorBoundary,
};
