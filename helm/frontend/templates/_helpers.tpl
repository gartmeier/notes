{{- define "notes-frontend.fullname" -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "notes-frontend.labels" -}}
app.kubernetes.io/name: {{ include "notes-frontend.fullname" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "notes-frontend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "notes-frontend.fullname" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}
