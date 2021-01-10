import { useRef, useState, useEffect, useCallback } from "react";
import { Engine, Scene, EngineOptions, SceneOptions } from "@babylonjs/core";

export interface BabylonOptions extends EngineOptions {
  antialias?: boolean;
  adaptToDeviceRatio?: boolean;
}

export type RenderFunction<S, A> = (
  scene: Scene,
  store: S,
  dispatch: (a: A) => void,
  canvas: HTMLCanvasElement
) => void;

export interface BabylonComponentProps<S, A> {
  init: RenderFunction<S, A>;
  draw: RenderFunction<S, A>;
  cleanup: RenderFunction<S, A>;
  options: BabylonOptions;
  sceneOptions: SceneOptions;
}

const defaultOptions = {} as { antialias: undefined; adaptToDeviceRatio: undefined };

export const useBabylon = <S, A extends { type: string }>(
  update: (s: S | undefined, a: A | { type: "@@INIT" }) => S,
  init: RenderFunction<S, A>,
  draw?: RenderFunction<S, A>,
  cleanup?: RenderFunction<S, A>,
  options: BabylonOptions = defaultOptions,
  sceneOptions?: SceneOptions
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const store = useRef<S>(update(undefined, { type: "@@INIT" }));
  const { antialias, adaptToDeviceRatio } = options;
  const [initialized, setInitialized] = useState(false);
  const [scene, setScene] = useState<Scene | null>(null);
  const dispatch = useCallback(
    (a: A) => {
      store.current = update(store.current, a);
    },
    [update]
  );

  useEffect(() => {
    const resize = () => {
      if (scene) scene.getEngine().resize();
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [scene]);

  useEffect(() => {
    const currentCanvas = canvasRef.current;
    const currentStore = store.current;
    if (!currentCanvas) return;
    if (!initialized) {
      setInitialized(true);
      const engine = new Engine(currentCanvas, antialias, options, adaptToDeviceRatio);
      const scene = new Scene(engine, sceneOptions);
      setScene(scene);
      if (scene.isReady()) init(scene, currentStore, dispatch, currentCanvas);
      else
        scene.onReadyObservable.addOnce(scene =>
          init(scene, currentStore, dispatch, currentCanvas)
        );
      engine.runRenderLoop(() => {
        draw && draw(scene, currentStore, dispatch, currentCanvas);
        scene.render();
      });
    }
    return () => {
      if (scene !== null) {
        cleanup && cleanup(scene, currentStore, dispatch, currentCanvas);
        scene.dispose();
      }
    };
  }, [
    dispatch,
    initialized,
    antialias,
    options,
    adaptToDeviceRatio,
    sceneOptions,
    init,
    draw,
    scene,
    cleanup
  ]);

  return canvasRef;
};
