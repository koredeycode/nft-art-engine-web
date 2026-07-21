import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";

const otlpEndpoint =
  process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? "http://localhost:4318";

export function initTelemetry() {
  if (!process.env.OTEL_ENABLED) return;

  const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({ url: `${otlpEndpoint}/v1/traces` }),
    metricReader: new PrometheusExporter({
      port: Number(process.env.OTEL_METRICS_PORT ?? 9464),
    }),
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();
}
