
;; transaction-gen-v1
;; High-Volume, Low-Cost Transaction Generator
;;
;; This contract allows users to "ping" the network with minimal cost.
;; It acts as a keep-alive and activity generator for the ecosystem.

(define-constant err-invalid-message (err u100))

;; Log every ping to generate chain data
(define-public (ping (message (string-ascii 64)))
    (begin
        (asserts! (> (len message) u0) err-invalid-message)
        (print {
            event: "ping",
            user: tx-sender,
            msg: message,
            time: block-height
        })
        (ok true)
    )
)

;; "Spam" mode: emits 5 events in one tx for higher density
(define-public (super-ping)
    (begin
        (print "Ping 1")
        (print "Ping 2")
        (print "Ping 3")
        (print "Ping 4")
        (print "Ping 5")
        (ok true)
    )
)
