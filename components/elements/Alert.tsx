import React from 'react'

type AlertProps = {
  type: 'info' | 'success' | 'warning' | 'danger'
  message: string
}

const Alert: React.FC<AlertProps> = ({ type, message }) => {
  const alertColor = `bg-alert-${type} border-alert-${type}`
  const alertLightColor = `bg-alert-${type}-light`
  const alertDarkColor = `bg-alert-${type}-dark`

  return (
    <div
      className={`p-m rounded-md ${alertColor} ${alertLightColor} ${alertDarkColor}`}
      role="alert"
    >
      <div className="flex">
        <div className="py-1">
          {type === 'info' && (
            <svg
              className="w-6 h-6 text-alert-info-dark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l.0001-.0001M12 6l.0001-.0001M4.93 4.93l.0001-.0001M19.07 19.07l.0001-.0001M6 12l.0001-.0001M18 12l.0001-.0001M4.93 19.07l.0001-.0001M19.07 4.93l.0001-.0001"
              />
            </svg>
          )}
          {type === 'success' && (
            <svg
              className="w-6 h-6 text-alert-success-dark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          {type === 'warning' && (
            <svg
              className="w-6 h-6 text-alert-warning-dark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v4M12 17h.01M19.94 5.03l-1.11 18.94-18.94-1.11 1.11-18.94L19.94 5.03z"
              />
            </svg>
          )}
          {type === 'danger' && (
            <svg
              className="w-6 h-6 text-alert-danger-dark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>
        <div className="ml-2">
          <p className="font-bold">{message}</p>
        </div>
      </div>
    </div>
  )
}

export default Alert

