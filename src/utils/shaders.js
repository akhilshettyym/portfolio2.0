export const simulationVertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

export const simulationFragmentShader = `
uniform sampler2D textureA;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;
uniform int frame;
varying vec2 vUv;

const float delta = 1.0;

void main() {

    vec2 uv = vUv;

    if(frame == 0) {
        gl_FragColor = vec4(0.0);
        return;
    }

    vec4 data = texture2D(textureA, uv);
    float pressure = data.x;
    float pVel = data.y;

    vec2 texelSize = 1.0 / resolution;

    float p_right = texture2D(textureA, uv + vec2(texelSize.x, 0.0)).x;
    float p_left  = texture2D(textureA, uv + vec2(-texelSize.x, 0.0)).x;
    float p_up    = texture2D(textureA, uv + vec2(0.0, texelSize.y)).x;
    float p_down  = texture2D(textureA, uv + vec2(0.0, -texelSize.y)).x;

    float laplacian =
    p_right + p_left + p_up + p_down - 4.0 * pressure;

    pVel += laplacian * 0.3;

    pressure += pVel * delta;

    pVel *= 0.96;
    pressure *= 0.985;

    vec2 mouseUV = mouse / resolution;

    if(mouse.x > 0.0){
        float dist = distance(uv, mouseUV);

        float radius = 0.045;
        float falloff = smoothstep(radius, 0.0, dist);

        pressure += 1.2 * falloff;
    }

    gl_FragColor = vec4(
        pressure,
        pVel,
        (p_right - p_left) * 0.5,
        (p_up - p_down) * 0.5
    );
}`

export const renderVertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

export const renderFragmentShader = `

uniform sampler2D textureA;
uniform sampler2D textureB;

varying vec2 vUv;

vec3 motionColor(float intensity) {

    vec3 calm = vec3(0.2, 0.6, 1.0);
    vec3 mid = vec3(0.7, 0.3, 1.0);
    vec3 high = vec3(1.0, 0.5, 0.2);

    float t1 = smoothstep(0.0, 0.3, intensity);
    float t2 = smoothstep(0.3, 0.8, intensity);

    vec3 color = mix(calm, mid, t1);
    color = mix(color, high, t2);

    return color;
}

void main() {

    vec4 sim = texture2D(textureA, vUv);
    vec4 base = texture2D(textureB, vUv);

    vec2 distortion = sim.zw * 0.22;
    vec2 uv = vUv + distortion;

    vec4 text =
        texture2D(textureB, uv) * 0.4 +
        texture2D(textureB, uv + vec2(0.001, 0.0)) * 0.15 +
        texture2D(textureB, uv - vec2(0.001, 0.0)) * 0.15 +
        texture2D(textureB, uv + vec2(0.0, 0.001)) * 0.15 +
        texture2D(textureB, uv - vec2(0.0, 0.001)) * 0.15;

    float finalMask = smoothstep(0.0, 0.7, text.r);

    float r = texture2D(textureB, uv + distortion * 0.12).r;
    float g = texture2D(textureB, uv).g;
    float b = texture2D(textureB, uv - distortion * 0.12).b;

    vec3 color = vec3(r, g, b);
    color *= finalMask;

    float intensity = length(sim.zw);

    intensity = smoothstep(0.0, 0.25, intensity);

    vec3 rippleCol = motionColor(intensity);

    color += rippleCol * intensity * 0.45;

    gl_FragColor = vec4(color, 1.0);
}
`;