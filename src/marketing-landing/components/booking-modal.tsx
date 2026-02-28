

import { useState, useCallback, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/marketing-landing/components/ui/dialog"
import { Button } from "@/marketing-landing/components/ui/button"
import { Input } from "@/marketing-landing/components/ui/input"
import { Label } from "@/marketing-landing/components/ui/label"
import { Calendar } from "@/marketing-landing/components/ui/calendar"
import { Badge } from "@/marketing-landing/components/ui/badge"
import {
  User,
  Baby,
  ArrowRight,
  ArrowLeft,
  Check,
  Clock,
  DollarSign,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Info,
} from "lucide-react"
import type { Service, AvailableDate } from "@/marketing-landing/lib/clinic-data"
import { cn } from "@/marketing-landing/lib/utils"
import { useSettings } from "@/hooks/useSettings"

// ---------- Types ----------
type PatientType = "adult" | "child" | null

interface AdultInfo {
  fullName: string
  dob: string
  phone: string
}

interface ChildInfo {
  childName: string
  dob: string
  guardianName: string
  guardianPhone: string
  guardianEmail: string
}

interface BookingState {
  step: number
  patientType: PatientType
  adultInfo: AdultInfo
  childInfo: ChildInfo
  selectedServiceId: string | null
  selectedDate: Date | undefined
  selectedPeriodId: string | null
  submitted: boolean
}

const TOTAL_STEPS = 5

const INITIAL_STATE: BookingState = {
  step: 1,
  patientType: null,
  adultInfo: { fullName: "", dob: "", phone: "" },
  childInfo: {
    childName: "",
    dob: "",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
  },
  selectedServiceId: null,
  selectedDate: undefined,
  selectedPeriodId: null,
  submitted: false,
}

const STEP_LABELS = [
  "Patient Type",
  "Personal Info",
  "Service",
  "Date & Period",
  "Confirm",
]

// ---------- Props ----------
interface BookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  services: Service[]
  availableDates: AvailableDate[]
}

export function BookingModal({
  open,
  onOpenChange,
  services,
  availableDates,
}: BookingModalProps) {
  const { createBookingRequest } = useSettings()
  const [state, setState] = useState<BookingState>(INITIAL_STATE)
  const [loadingPeriods, setLoadingPeriods] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const update = useCallback(
    (patch: Partial<BookingState>) =>
      setState((prev) => ({ ...prev, ...patch })),
    []
  )

  const handleClose = useCallback(
    (v: boolean) => {
      if (!v) setState(INITIAL_STATE)
      onOpenChange(v)
    },
    [onOpenChange]
  )

  // Scroll content area to top on step change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }, [state.step])

  const selectedService = services.find(
    (s) => s.id === state.selectedServiceId
  )

  const selectedDateISO = state.selectedDate
    ? state.selectedDate.toISOString().split("T")[0]
    : null

  const currentDateEntry = availableDates.find(
    (d) => d.date === selectedDateISO
  )
  const periods = currentDateEntry?.periods ?? []

  const selectedPeriod = periods.find((p) => p.id === state.selectedPeriodId)

  const availableDateSet = new Set(availableDates.map((d) => d.date))

  // Simulate loading periods when date changes
  useEffect(() => {
    if (state.selectedDate) {
      setLoadingPeriods(true)
      const timer = setTimeout(() => setLoadingPeriods(false), 350)
      return () => clearTimeout(timer)
    }
  }, [state.selectedDate])

  const handleConfirm = async () => {
    setIsSubmitting(true)
    try {
      const patientName =
        state.patientType === "adult"
          ? state.adultInfo.fullName
          : state.childInfo.childName

      const contactInfo =
        state.patientType === "adult"
          ? state.adultInfo.phone
          : state.childInfo.guardianPhone

      const email =
        state.patientType === "adult"
          ? ""
          : state.childInfo.guardianEmail

      const payload = {
        patient_name: patientName,
        patient_type: state.patientType,
        date_of_birth: state.patientType === "adult" ? state.adultInfo.dob : state.childInfo.dob,
        contact_type: "phone",
        contact_info: contactInfo,
        requested_date: selectedDateISO,
        requested_period: selectedPeriod?.label || state.selectedPeriodId,
        service_id: state.selectedServiceId,
        service_name: selectedService?.title || "Unknown Service",
        guardian_name: state.patientType === "child" ? state.childInfo.guardianName : null,
        guardian_phone: state.patientType === "child" ? state.childInfo.guardianPhone : null,
        guardian_email: email || null,
        status: "pending",
      }

      const result = await createBookingRequest(payload)
      if (result) {
        update({ submitted: true })
      }
    } catch (error) {
      console.error("Submission failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // ---------- Validation ----------
  const canProceed = (): boolean => {
    switch (state.step) {
      case 1:
        return state.patientType !== null
      case 2:
        if (state.patientType === "adult") {
          const { fullName, dob, phone } = state.adultInfo
          return (
            fullName.trim().length > 0 &&
            dob.length > 0 &&
            phone.trim().length > 0
          )
        }
        if (state.patientType === "child") {
          const { childName, dob, guardianName, guardianPhone } =
            state.childInfo
          return (
            childName.trim().length > 0 &&
            dob.length > 0 &&
            guardianName.trim().length > 0 &&
            guardianPhone.trim().length > 0
          )
        }
        return false
      case 3:
        return state.selectedServiceId !== null
      case 4:
        return (
          state.selectedDate !== undefined && state.selectedPeriodId !== null
        )
      case 5:
        return true
      default:
        return false
    }
  }

  // ---------- Step Indicator ----------
  function renderStepIndicator() {
    return (
      <div className="flex items-center justify-center gap-1 px-1 pb-2 sm:gap-2">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1
          const isActive = stepNum === state.step
          const isDone = stepNum < state.step
          return (
            <div key={label} className="flex items-center gap-1 sm:gap-2">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold transition-all duration-300 sm:h-8 sm:w-8 sm:text-xs",
                    isActive &&
                    "bg-primary text-primary-foreground shadow-md shadow-primary/25",
                    isDone && "bg-primary/15 text-primary",
                    !isActive && !isDone && "bg-muted text-muted-foreground"
                  )}
                >
                  {isDone ? <Check className="h-3 w-3" /> : stepNum}
                </div>
                <span
                  className={cn(
                    "hidden text-center text-[10px] leading-tight sm:block",
                    isActive
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-4 rounded-full transition-colors duration-300 sm:w-6",
                    isDone ? "sm:mb-4" : "sm:mb-4",
                    stepNum < state.step ? "bg-primary/40" : "bg-border"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // ---------- Step 1: Patient Type ----------
  function renderStep1() {
    return (
      <div className="flex flex-col gap-5 px-1">
        <p className="text-center text-sm text-muted-foreground">
          Who is the appointment for?
        </p>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {(
            [
              {
                type: "adult" as const,
                icon: User,
                label: "Adult Patient",
                desc: "18 years or older",
              },
              {
                type: "child" as const,
                icon: Baby,
                label: "Child Patient",
                desc: "Under 18 years",
              },
            ] as const
          ).map(({ type, icon: Icon, label, desc }) => (
            <button
              key={type}
              type="button"
              onClick={() => update({ patientType: type })}
              className={cn(
                "group flex flex-col items-center gap-3 rounded-2xl border-2 p-5 transition-all duration-200 hover:border-primary/50 hover:shadow-md sm:p-6",
                state.patientType === type
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-card"
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-200 sm:h-14 sm:w-14",
                  state.patientType === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                )}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ---------- Step 2: Personal Info ----------
  function renderStep2() {
    if (state.patientType === "adult") {
      return (
        <div className="flex flex-col gap-4 px-1">
          <FormField label="Full Name" htmlFor="fullName">
            <Input
              id="fullName"
              placeholder="John Doe"
              value={state.adultInfo.fullName}
              onChange={(e) =>
                update({
                  adultInfo: { ...state.adultInfo, fullName: e.target.value },
                })
              }
              className="h-11"
            />
          </FormField>
          <FormField label="Date of Birth" htmlFor="dob">
            <Input
              id="dob"
              type="date"
              value={state.adultInfo.dob}
              onChange={(e) =>
                update({
                  adultInfo: { ...state.adultInfo, dob: e.target.value },
                })
              }
              className="h-11"
            />
          </FormField>
          <FormField label="Phone Number" htmlFor="phone">
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={state.adultInfo.phone}
              onChange={(e) =>
                update({
                  adultInfo: { ...state.adultInfo, phone: e.target.value },
                })
              }
              className="h-11"
            />
          </FormField>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-4 px-1">
        <FormField label="Child Full Name" htmlFor="childName">
          <Input
            id="childName"
            placeholder="Jane Doe"
            value={state.childInfo.childName}
            onChange={(e) =>
              update({
                childInfo: { ...state.childInfo, childName: e.target.value },
              })
            }
            className="h-11"
          />
        </FormField>
        <FormField label="Date of Birth" htmlFor="childDob">
          <Input
            id="childDob"
            type="date"
            value={state.childInfo.dob}
            onChange={(e) =>
              update({
                childInfo: { ...state.childInfo, dob: e.target.value },
              })
            }
            className="h-11"
          />
        </FormField>

        {/* Guardian card */}
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Guardian Information
          </p>
          <div className="flex flex-col gap-4">
            <FormField label="Guardian Name" htmlFor="guardianName">
              <Input
                id="guardianName"
                placeholder="Parent / Guardian name"
                value={state.childInfo.guardianName}
                onChange={(e) =>
                  update({
                    childInfo: {
                      ...state.childInfo,
                      guardianName: e.target.value,
                    },
                  })
                }
                className="h-11"
              />
            </FormField>
            <FormField label="Guardian Phone" htmlFor="guardianPhone">
              <Input
                id="guardianPhone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={state.childInfo.guardianPhone}
                onChange={(e) =>
                  update({
                    childInfo: {
                      ...state.childInfo,
                      guardianPhone: e.target.value,
                    },
                  })
                }
                className="h-11"
              />
            </FormField>
            <FormField
              label="Guardian Email"
              htmlFor="guardianEmail"
              optional
            >
              <Input
                id="guardianEmail"
                type="email"
                placeholder="email@example.com"
                value={state.childInfo.guardianEmail}
                onChange={(e) =>
                  update({
                    childInfo: {
                      ...state.childInfo,
                      guardianEmail: e.target.value,
                    },
                  })
                }
                className="h-11"
              />
            </FormField>
          </div>
        </div>
      </div>
    )
  }

  // ---------- Step 3: Service Selection ----------
  function renderStep3() {
    return (
      <div className="flex flex-col gap-3 px-1">
        <p className="text-center text-sm text-muted-foreground">
          Choose a service for your appointment
        </p>
        <div className="flex flex-col gap-2.5">
          {services.map((service) => {
            const isSelected = state.selectedServiceId === service.id
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => update({ selectedServiceId: service.id })}
                className={cn(
                  "flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200 hover:border-primary/40 sm:gap-4",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card"
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {service.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 shrink-0" />
                      {service.duration}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                      <DollarSign className="h-3 w-3 shrink-0" />
                      {service.price}
                    </span>
                  </div>
                </div>
                <div
                  className={cn(
                    "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30"
                  )}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ---------- Step 4: Date & Period ----------
  function renderStep4() {
    return (
      <div className="flex flex-col gap-5 px-1">
        {/* Date Picker */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-center text-sm text-muted-foreground">
            Pick an available date for your visit
          </p>
          <div className="w-full overflow-x-auto">
            <Calendar
              mode="single"
              selected={state.selectedDate}
              onSelect={(date) =>
                update({ selectedDate: date, selectedPeriodId: null })
              }
              disabled={(date) => {
                const iso = date.toISOString().split("T")[0]
                return !availableDateSet.has(iso)
              }}
              className="mx-auto rounded-xl border border-border"
            />
          </div>
        </div>

        {/* Period Selection */}
        {state.selectedDate && (
          <div className="flex flex-col gap-3">
            <div className="h-px bg-border" />
            <p className="text-center text-sm font-medium text-foreground">
              Available periods for{" "}
              {state.selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>

            {/* Fixed-height container prevents layout shift */}
            <div className="min-h-[120px]">
              {loadingPeriods ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading availability...
                  </span>
                </div>
              ) : periods.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No availability for this date.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Please select another date.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {periods.map((period) => {
                    const isSelected = state.selectedPeriodId === period.id
                    const isLimited =
                      period.available && period.description
                        ? /limited|[12] slot/i.test(period.description)
                        : false
                    return (
                      <button
                        key={period.id}
                        type="button"
                        disabled={!period.available}
                        onClick={() =>
                          update({ selectedPeriodId: period.id })
                        }
                        className={cn(
                          "flex items-center justify-between rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-200",
                          !period.available &&
                          "cursor-not-allowed border-border bg-muted/50 opacity-50",
                          period.available &&
                          !isSelected &&
                          "border-border bg-card hover:border-primary/40",
                          isSelected &&
                          "border-primary bg-primary/5 shadow-sm"
                        )}
                      >
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <span
                            className={cn(
                              "truncate text-sm font-medium",
                              period.available
                                ? "text-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            {period.label}
                          </span>
                          {period.description && (
                            <span
                              className={cn(
                                "text-xs",
                                !period.available
                                  ? "text-muted-foreground"
                                  : isLimited
                                    ? "text-amber-600"
                                    : "text-muted-foreground"
                              )}
                            >
                              {period.description}
                            </span>
                          )}
                        </div>
                        <div
                          className={cn(
                            "ml-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : period.available
                                ? "border-muted-foreground/30"
                                : "border-muted-foreground/20"
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Info note — only show when periods are loaded and exist */}
            {!loadingPeriods && periods.length > 0 && (
              <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  The clinic will confirm the exact appointment time within your
                  selected period.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // ---------- Step 5: Review & Confirm ----------
  function renderStep5() {
    const patientName =
      state.patientType === "adult"
        ? state.adultInfo.fullName
        : state.childInfo.childName

    return (
      <div className="flex flex-col gap-5 px-1">
        <p className="text-center text-sm text-muted-foreground">
          Please review your booking details
        </p>
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-secondary/30 p-4 sm:p-5">
          {/* Patient details */}
          <SummaryRow label="Patient Type">
            <Badge variant="secondary" className="capitalize">
              {state.patientType}
            </Badge>
          </SummaryRow>
          <SummaryRow label="Patient Name">{patientName}</SummaryRow>
          {state.patientType === "child" && (
            <SummaryRow label="Guardian">
              {state.childInfo.guardianName}
            </SummaryRow>
          )}

          <div className="my-1 h-px bg-border" />

          {/* Service details */}
          <SummaryRow label="Service">
            {selectedService?.title ?? "---"}
          </SummaryRow>
          <SummaryRow label="Duration">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              {selectedService?.duration}
            </span>
          </SummaryRow>
          <SummaryRow label="Price">
            <span className="font-semibold text-primary">
              {selectedService?.price}
            </span>
          </SummaryRow>

          <div className="my-1 h-px bg-border" />

          {/* Schedule details */}
          <SummaryRow label="Date">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3 w-3 text-muted-foreground" />
              {state.selectedDate?.toLocaleDateString("en-US", {
                weekday: "short",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </SummaryRow>
          <SummaryRow label="Period">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              {selectedPeriod?.label ?? "---"}
            </span>
          </SummaryRow>
        </div>
      </div>
    )
  }

  // ---------- Success State ----------
  function renderSuccess() {
    return (
      <div className="flex flex-col items-center gap-6 py-6 sm:py-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">
            Appointment Booked!
          </h3>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Your appointment has been confirmed. We will send a confirmation to
            your phone shortly.
          </p>
        </div>
        <div className="flex w-full max-w-xs flex-col gap-2.5 rounded-xl border border-border bg-secondary/30 p-4 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="shrink-0 text-xs text-muted-foreground">
              Service
            </span>
            <span className="truncate text-right font-medium text-foreground">
              {selectedService?.title}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="shrink-0 text-xs text-muted-foreground">
              Date
            </span>
            <span className="text-foreground">
              {state.selectedDate?.toLocaleDateString("en-US", {
                weekday: "short",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="shrink-0 text-xs text-muted-foreground">
              Period
            </span>
            <span className="truncate text-right text-foreground">
              {selectedPeriod?.label}
            </span>
          </div>
        </div>
        <Button
          className="mt-2 rounded-full px-8"
          onClick={() => handleClose(false)}
        >
          Done
        </Button>
      </div>
    )
  }

  // ---------- Main Render ----------
  const stepRenderers: Record<number, () => React.ReactNode> = {
    1: renderStep1,
    2: renderStep2,
    3: renderStep3,
    4: renderStep4,
    5: renderStep5,
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[90dvh] flex-col gap-0 overflow-hidden p-0 sm:max-h-[85dvh] sm:max-w-[460px]">
        {state.submitted ? (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>Booking Confirmed</DialogTitle>
              <DialogDescription>
                Your appointment has been successfully booked.
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto px-5 sm:px-6">
              {renderSuccess()}
            </div>
          </>
        ) : (
          <>
            {/* Header */}
            <div className="shrink-0 px-5 pt-5 pb-2 sm:px-6 sm:pt-6">
              <DialogHeader className="pb-2">
                <DialogTitle className="text-center text-base">
                  {STEP_LABELS[state.step - 1]}
                </DialogTitle>
                <DialogDescription className="text-center text-xs">
                  Step {state.step} of {TOTAL_STEPS}
                </DialogDescription>
              </DialogHeader>
              {renderStepIndicator()}
            </div>

            {/* Divider */}
            <div className="shrink-0 border-t border-border" />

            {/* Scrollable content area */}
            <div
              ref={scrollRef}
              className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-5"
            >
              {stepRenderers[state.step]?.()}
            </div>

            {/* Sticky footer */}
            <div className="shrink-0 border-t border-border bg-card px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                {state.step > 1 ? (
                  <Button
                    variant="outline"
                    className="rounded-full px-5"
                    onClick={() => update({ step: state.step - 1 })}
                  >
                    <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}
                {state.step < TOTAL_STEPS ? (
                  <Button
                    className="rounded-full px-5"
                    disabled={!canProceed()}
                    onClick={() => update({ step: state.step + 1 })}
                  >
                    Continue
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <Button
                    className="rounded-full px-5"
                    disabled={isSubmitting}
                    onClick={handleConfirm}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="mr-1.5 h-3.5 w-3.5" />
                        Confirm Booking
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ---------- Helper components ----------

function FormField({
  label,
  htmlFor,
  optional,
  children,
}: {
  label: string
  htmlFor: string
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="text-sm">
        {label}
        {optional && (
          <span className="ml-1 font-normal text-muted-foreground">
            (optional)
          </span>
        )}
      </Label>
      {children}
    </div>
  )
}

function SummaryRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="shrink-0 text-xs text-muted-foreground">{label}</span>
      <span className="min-w-0 text-right text-sm text-foreground">
        {children}
      </span>
    </div>
  )
}
