"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export function GlobePanel() {
    const point = useMemo(
        () => ({
            lat: 12.9141,
            lng: 74.856,
        }),
        []
    );

    const labelsData = useMemo(
        () => [
            {
                lat: point.lat,
                lng: point.lng,
                text: "I'm here!",
                color: "white",
                size: 0.8,
            },
        ],
        [point]
    );

    const marker = useMemo(
        () =>
            new THREE.Mesh(
                new THREE.SphereGeometry(0.6, 24, 24),
                new THREE.MeshStandardMaterial({
                    color: "#ff3b3b",
                    emissive: "#ff0000",
                    emissiveIntensity: 1.2,
                    roughness: 0.4,
                    metalness: 0.2,
                })
            ),
        []
    );

    return (
        <div className="flex justify-center items-center">
            <Globe
                height={260}
                width={260}
                backgroundColor="rgba(0,0,0,0)"

                globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"
                bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"

                showAtmosphere
                atmosphereColor="#66b3ff"
                atmosphereAltitude={0.15}

                showGraticules

                autoRotate
                autoRotateSpeed={0.4}

                labelsData={labelsData}
                labelText="text"
                labelColor={() => "rgba(255,255,255,0.9)"}
                labelSize={0.8}

                objectsData={[point]}
                objectLabel={() => "Location: Mangalore, India"}
                objectThreeObject={() => marker}

                cameraDistanceRadiusScale={2.6}
            />
        </div>
    );
}