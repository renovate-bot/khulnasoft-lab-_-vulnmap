package main

import (
	"fmt"
	"log"
	"os"
	"path"
	"strings"

	"github.com/khulnasoft-lab/vulnmap/cliv2/internal/utils"
	"github.com/khulnasoft-lab/go-application-framework/pkg/networking/certs"
)

func main() {
	certName := os.Args[1]

	debugLogger := log.Default()

	vulnmapDNSNamesStr := os.Getenv("VULNMAP_DNS_NAMES")
	var vulnmapDNSNames []string
	fmt.Println("VULNMAP_DNS_NAMES:", vulnmapDNSNamesStr)
	if vulnmapDNSNamesStr != "" {
		vulnmapDNSNames = strings.Split(vulnmapDNSNamesStr, ",")
	} else {
		// We use app.dev.vulnmap.khulnasoft.com for development
		vulnmapDNSNames = []string{"vulnmap.khulnasoft.com", "*.vulnmap.khulnasoft.com", "*.dev.vulnmap.khulnasoft.com"}
	}

	debugLogger.Println("certificate name:", certName)
	debugLogger.Println("VULNMAP_DNS_NAMES:", vulnmapDNSNames)

	certPEMBlockBytes, keyPEMBlockBytes, err := certs.MakeSelfSignedCert(certName, vulnmapDNSNames, debugLogger)
	if err != nil {
		log.Fatal(err)
	}

	// certString := certPEMBytesBuffer.String()
	certPEMString := string(certPEMBlockBytes)
	keyPEMString := string(keyPEMBlockBytes)

	keyAndCert := keyPEMString + certPEMString

	// write to file
	certFilePath := path.Join(".", certName+".crt")
	keyFilePath := path.Join(".", certName+".key")
	joinedPemFilePath := path.Join(".", certName+".pem") // key and cert in one file - used by mitmproxy

	_ = utils.WriteToFile(certFilePath, certPEMString)
	_ = utils.WriteToFile(keyFilePath, keyPEMString)
	_ = utils.WriteToFile(joinedPemFilePath, keyAndCert)
}