export default function handle(req, res) {
    switch (req.method) {
        case "GET":
            res.status(200).json({message:demo_parties_status})
    }
}