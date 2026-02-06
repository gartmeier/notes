{{- define "notes-backend.fullname" -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "notes-backend.labels" -}}
app.kubernetes.io/name: {{ include "notes-backend.fullname" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "notes-backend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "notes-backend.fullname" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}
