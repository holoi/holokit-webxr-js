import XRDevice from "./XRDevice";

let SESSION_ID = 0;
class Session {
  constructor(mode, enabledFeatures) {
    this.mode = mode;
    this.enabledFeatures = enabledFeatures;
    this.ended = null;
    this.baseLayer = null;
    this.id = ++SESSION_ID;
  }
}

export default class HoloKitDevice extends XRDevice {
  constructor(global) {
    super(global);

    this.sessions = new Map();
  }

  onBaseLayerSet(sessionId, layer) {
    const session = this.sessions.get(sessionId);
    session.bayseLayer = layer;
  }

  isSessionSupported(mode) {
    return mode == "immersive-ar";
  }

  isFeatureSupported(featureDescriptor) {
    switch (featureDescriptor) {
      case "local":
        return true;
      default:
        return false;
    }
  }

  async requestSession(mode, enabledFeatures) {
    if (!this.isSessionSupported(mode)) {
      return Promise.reject();
    }

    const session = new Session(mode, enabledFeatures);

    this.sessions.set(session.id, session);

    return Promise.resolve(session.id);
  }

  requestAnimationFrame(callback) {
    return window.requestAnimationFrame(callback);
  }

  cancelAnimationFrame(handle) {
    window.cancelAnimationFrame(handle);
  }

  onFrameStart(sessionId, renderState) {
    const session = this.sessions.get(sessionId);

    if (session.baseLayer) {
    }
  }

  onFrameEnd(sessionId) {}

  async endSession(sessionId) {
    const session = this.sessions.get(sessionId);
    session.ended = true;
  }

  doesSessionSupportReferenceSpace(sessionId, type) {
    const session = this.sessions.get(sessionId);
    if (session.ended) {
      return false;
    }

    return session.enabledFeatures.has(type);
  }

  requestStageBounds() {
    return null;
  }

  async requestFrameOfReferenceTransform(type, options) {
    return null;
  }

  getProjectionMatrix(eye) {}

  getViewport(sessionId, eye, layer, target) {
    const session = this.sessions.get(sessionId);
    const { width, height } = layer.context.canvas;

    target.x = target.y = 0;
    target.width = width;
    target.height = height;
    return true;
  }

  getBasePoseMatrix() {
    return this.identityMatrix;
  }

  getBaseViewMatrix(eye) {
    return this.identityMatrix;
  }

  getInputSources() {
    return [];
  }

  getInputPose(inputSource, coordinateSystem, poseType) {
    return null;
  }

  onWindowResize() {}
}
