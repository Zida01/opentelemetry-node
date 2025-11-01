const { NodeSDK } = require("@opentelemetry/sdk-node")
const { ConsoleSpanExporter } = require("@opentelemetry/sdk-trace-base")
const { PeriodicExportingMetricReader, ConsoleMetricExporter } = require("@opentelemetry/sdk-metrics"); 
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } = require("@opentelemetry/semantic-conventions");
const { resourceFromAttributes} = require("@opentelemetry/resources");
const { SimpleLogRecordProcessor, ConsoleLogRecordExporter} = require("@opentelemetry/sdk-logs");

 
const sdk = new NodeSDK({
    // define resources
    resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: "todo-services",
        [ATTR_SERVICE_VERSION]: "1.1.0"
    }),
  traceExporter: new ConsoleSpanExporter(),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),
  }),
  logRecordProcessors:[new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())],
  instrumentations:[getNodeAutoInstrumentations()],
});


sdk.start();

